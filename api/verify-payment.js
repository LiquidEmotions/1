/* POST /api/verify-payment
   body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, order:<order snapshot> }
         or { recover:true, razorpay_order_id } when the customer returns after paying in another app
   1. checks Razorpay's signature (proves the payment is real)
   2. asks Razorpay for the payment, to confirm status and card type
   3. gives the order its LE number (only now, so failed payments never use a number)
   4. sends the full order to the shop owner on Telegram (once per order) */

const crypto = require("crypto");

const RZP = "https://api.razorpay.com/v1";
const COUNTER_URL = process.env.ORDER_COUNTER_URL ||
  "https://script.google.com/macros/s/AKfycbx-DJzp1TAsu4U8Ha9bGrP0BB8j_WR3iL2bG1SyuKZQAgt0QH8-5RqGCyfx3RoKZa2N/exec";

/* Order alerts to your phone via Telegram (free). Set both in Vercel. */
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

const clip = (v, n) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, n || 200);
const rupees = (n) => "Rs " + Number(n || 0).toLocaleString("en-IN");

function buildAlert(orderNumber, o, payment, paidPaise, feeKeptPaise){
  const c = (o && o.customer) || {};
  const lines = ((o && o.lines) || []).slice(0, 40)
    .map(l => `- ${clip(l.name, 80)} (${clip(l.size, 10)}) x${clip(l.qty, 3)}  ${rupees(l.lineTotal)}`).join("\n");
  const via = payment.method === "card" ? `card${payment.card && payment.card.type ? " (" + payment.card.type + ")" : ""}` : payment.method;
  const rows = [
    `NEW PAID ORDER ${orderNumber || "(number unavailable, use payment ID)"}`,
    "",
    "CUSTOMER",
    clip(c.name), clip(c.phone), clip(c.email),
    "",
    "SHIP TO",
    clip(c.addr, 300), `${clip(c.city)}, ${clip(c.state)} ${clip(c.pin, 12)}`, clip(c.country),
    "",
    "ITEMS",
    lines,
    "",
    `Subtotal: ${rupees(o && o.subtotal)}`,
    `Shipping (${clip(o && o.zoneLabel, 30)}): ${o && o.shipping ? rupees(o.shipping) : "Free"}`
  ];
  if(feeKeptPaise > 0) rows.push(`Card fee: ${rupees(feeKeptPaise / 100)}`);
  rows.push(`TOTAL PAID: ${rupees(paidPaise / 100)}`, `Paid via: ${via}`, `Payment ID: ${payment.id}`);
  return rows.join("\n");
}

async function sendTelegram(text){
  if(!TG_TOKEN || !TG_CHAT) return false;
  try{
    const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text })
    });
    return r.ok;
  }catch(e){ return false; }
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if(req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if(!keyId || !keySecret) return res.status(500).json({ error: "Payments are not set up yet." });
  const auth = "Basic " + Buffer.from(keyId + ":" + keySecret).toString("base64");
  const rz = async (method, url, payload) => {
    const r = await fetch(RZP + url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: payload ? JSON.stringify(payload) : undefined
    });
    const json = await r.json().catch(() => ({}));
    return { ok: r.ok, json };
  };

  try{
    const b = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const orderId = String(b.razorpay_order_id || "");
    let paymentId = String(b.razorpay_payment_id || "");
    const signature = String(b.razorpay_signature || "");

    if(b.recover){
      /* Customer came back to the page after paying in another app (e.g. a UPI app):
         ask Razorpay directly whether this order has a successful payment. */
      if(!orderId) return res.status(400).json({ error: "Missing order." });
      const list = await rz("GET", `/orders/${orderId}/payments`);
      const done = list.ok && (list.json.items || []).find(p => p.status === "captured" || p.status === "authorized");
      if(!done) return res.status(402).json({ error: "Payment is not complete." });
      paymentId = done.id;
    }else{
      if(!orderId || !paymentId || !signature) return res.status(400).json({ error: "Missing payment details." });
      /* 1. signature */
      const expected = crypto.createHmac("sha256", keySecret).update(orderId + "|" + paymentId).digest("hex");
      const a = Buffer.from(expected), c = Buffer.from(signature);
      if(a.length !== c.length || !crypto.timingSafeEqual(a, c)){
        return res.status(400).json({ error: "Payment could not be verified." });
      }
    }

    /* 2. the payment and the order, straight from Razorpay */
    const [pay, ord] = await Promise.all([
      rz("GET", `/payments/${paymentId}?expand[]=card`),
      rz("GET", `/orders/${orderId}`)
    ]);
    if(!pay.ok || !ord.ok) return res.status(502).json({ error: "Could not confirm the payment with Razorpay." });
    const payment = pay.json, order = ord.json;
    if(payment.order_id !== orderId) return res.status(400).json({ error: "Payment does not match this order." });
    if(payment.status !== "captured" && payment.status !== "authorized"){
      return res.status(402).json({ error: "Payment is not complete.", status: payment.status });
    }

    const notes = Object.assign({}, order.notes || {});
    const feePaise = parseInt(notes.fee_paise, 10) || 0;
    const cardType = payment.card && payment.card.type ? payment.card.type : null;

    /* 3. the card fee (if any) stays on every card, credit or debit */
    const refundedPaise = payment.amount_refunded || 0;
    let notesChanged = false;

    /* 4. order number, issued once per Razorpay order */
    let orderNumber = notes.le_order || null;
    if(!orderNumber){
      try{
        const r = await fetch(COUNTER_URL, { method: "POST" });
        const j = await r.json();
        orderNumber = j.orderNumber || null;
      }catch(e){ orderNumber = null; }
      if(orderNumber){ notes.le_order = orderNumber; notes.le_payment = paymentId; notesChanged = true; }
    }
    /* 5. tell the shop owner, once per order */
    let notified = notes.le_notified === "1";
    if(!notified && b.order){
      const feeKeptPaise = payment.method === "card" ? feePaise : 0;
      notified = await sendTelegram(buildAlert(orderNumber, b.order, payment, payment.amount - refundedPaise, feeKeptPaise));
      if(notified){ notes.le_notified = "1"; notesChanged = true; }
    }

    if(notesChanged) await rz("PATCH", `/orders/${orderId}`, { notes });

    return res.status(200).json({
      ok: true,
      orderNumber,
      paymentId,
      method: payment.method,
      cardType,
      paidPaise: payment.amount - refundedPaise,
      notified,
      refundedPaise
    });
  }catch(err){
    return res.status(500).json({ error: "Could not confirm the payment.", message: err.message });
  }
};
