/* api/_pricing.js — works out what an order really costs, on the server.
   It runs your own store.js in a sandbox and applies the live Google Sheet
   on top of it, exactly like the website does, so the server and the site
   always agree on prices (and a customer can't change the amount). */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

/* Keep these in step with checkout.html */
const SHIPPING_ZONES = { ncr: 55, india: 75 };
const FREE_SHIP_QTY = 4;
const CARD_FEE_RATE = 0.026;      // 2.6% on credit cards
const CACHE_MS = 60 * 1000;       // re-read the sheet at most once a minute

let cache = { at: 0, prices: null, maxQty: 10 };

function readStoreJs(){
  const places = [path.join(process.cwd(), "store.js"), path.join(__dirname, "..", "store.js")];
  for(const p of places){
    try{ return fs.readFileSync(p, "utf8"); }catch(e){ /* try next */ }
  }
  throw new Error("store.js not found next to the api folder (check vercel.json includeFiles)");
}

function makeSandbox(){
  const noop = () => {};
  const sb = {
    console: { log: noop, info: noop, warn: noop, error: noop },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    location: { search: "", href: "" },
    document: {
      addEventListener: noop, getElementById: () => null, querySelector: () => null,
      querySelectorAll: () => [], createElement: () => ({ style: {} }), body: { appendChild: noop }
    },
    fetch: () => Promise.reject(new Error("disabled in sandbox")),
    Event: class { constructor(t){ this.type = t; } },
    navigator: {}, setTimeout, clearTimeout, URL
  };
  sb.window = sb;
  sb.addEventListener = noop;
  sb.dispatchEvent = noop;
  sb.requestAnimationFrame = noop;
  return vm.createContext(sb);
}

async function getText(url){
  const r = await fetch(url, { cache: "no-store" });
  if(!r.ok) throw new Error("HTTP " + r.status);
  return r.text();
}

async function loadPrices(){
  const ctx = makeSandbox();
  vm.runInContext(readStoreJs(), ctx, { filename: "store.js" });
  const run = (code) => vm.runInContext(code, ctx);

  const urls = run("({ a: LE_SHEET_URL, b: LE_SHEET_URL_ALT, c: LE_CATALOGUE_URL, min: LE_SHEET_MIN_ROWS })");
  let data = null;
  for(const url of [urls.a, urls.b]){
    try{
      ctx.__csv = await getText(url);
      const parsed = run("leParseSheetRows(leParseCsv(__csv))");
      if(parsed.rows.length >= urls.min){ data = parsed; break; }
    }catch(e){ /* try the next route */ }
  }
  if(data){
    try{
      ctx.__csv = await getText(urls.c);
      data.catalogue = run("leParseCatalogueRows(leParseCsv(__csv))");
    }catch(e){ data.catalogue = null; }
    ctx.__data = data;
    run("leApplySheetData(__data)");
  }
  /* If the sheet can't be reached, the prices inside store.js are used,
     the same fallback the website uses. */

  const prices = run("Object.fromEntries(FRAGRANCES.map(f => [f.id, Object.assign({}, f.prices)]))");
  const maxQty = run("LE_MAX_QTY");
  return { prices, maxQty };
}

async function getPrices(){
  if(cache.prices && Date.now() - cache.at < CACHE_MS) return cache;
  const { prices, maxQty } = await loadPrices();
  cache = { at: Date.now(), prices, maxQty };
  return cache;
}

/* items: [{ id, size, qty }]  ->  totals in whole rupees */
async function priceOrder(items, zone, method){
  if(!Array.isArray(items) || items.length === 0 || items.length > 60) throw new Error("Your cart is empty.");
  if(!(zone in SHIPPING_ZONES)) throw new Error("Unknown delivery area.");
  const { prices, maxQty } = await getPrices();

  let subtotal = 0, count = 0;
  const lines = [];
  for(const it of items){
    const table = prices[it && it.id];
    const unit = table && table[it.size];
    const qty = Math.floor(Number(it && it.qty));
    if(!unit || !(qty >= 1) || qty > maxQty){
      const err = new Error("An item in your cart is no longer available. Please review your cart.");
      err.code = "stale_cart";
      throw err;
    }
    subtotal += unit * qty;
    count += qty;
    lines.push({ id: it.id, size: it.size, qty, unit });
  }

  const shipping = count >= FREE_SHIP_QTY ? 0 : SHIPPING_ZONES[zone];
  const base = subtotal + shipping;
  const fee = method === "card" ? Math.round(base * CARD_FEE_RATE) : 0;
  return { lines, count, subtotal, shipping, base, fee, total: base + fee };
}

module.exports = { priceOrder, SHIPPING_ZONES, FREE_SHIP_QTY, CARD_FEE_RATE };
