/*
  localize-images.js — copies every perfume photo to your own site.

  Why: store.js points at images on other websites (fimgs.net). If that
  site changes or blocks hotlinking, your photos disappear. This script
  downloads each one into an /images folder and points store.js at it.

  How to run (needs Node 18+, run it on your computer, not on Vercel):
    1. Put this file next to store.js
    2. node localize-images.js --dry     (just lists what it would do)
    3. node localize-images.js           (downloads + rewrites store.js)
    4. Upload the new /images folder and store.js to your site

  Your original is saved as store.js.bak first. Images that fail to
  download are left pointing at their original address.
*/
const fs = require("fs");
const path = require("path");

const DRY = process.argv.includes("--dry");
const FILE = path.join(__dirname, "store.js");
const OUT = path.join(__dirname, "images");

(async () => {
  let src = fs.readFileSync(FILE, "utf8");
  // Matches   id: "x" ... image: "https://..."   inside each fragrance block
  const re = /id:\s*"([^"]+)"[\s\S]*?image:\s*"(https?:\/\/[^"]+)"/g;
  const jobs = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(src))) {
    const [, id, url] = m;
    if (seen.has(url)) continue;
    seen.add(url);
    const ext = (url.split("?")[0].match(/\.(avif|webp|png|jpe?g|gif)$/i) || [, "jpg"])[1].toLowerCase();
    jobs.push({ id, url, file: `${id}.${ext}` });
  }
  console.log(`${jobs.length} images found`);
  if (DRY) { jobs.forEach(j => console.log(`  ${j.url}  ->  images/${j.file}`)); return; }

  fs.mkdirSync(OUT, { recursive: true });
  fs.copyFileSync(FILE, FILE + ".bak");
  let ok = 0, failed = [];
  for (const j of jobs) {
    try {
      const res = await fetch(j.url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      fs.writeFileSync(path.join(OUT, j.file), Buffer.from(await res.arrayBuffer()));
      src = src.split(`"${j.url}"`).join(`"images/${j.file}"`);
      ok++;
      process.stdout.write(".");
    } catch (e) {
      failed.push(`${j.id}: ${e.message}`);
    }
  }
  fs.writeFileSync(FILE, src);
  console.log(`\nDone. ${ok} downloaded, ${failed.length} failed.`);
  failed.forEach(f => console.log("  failed — " + f));
})();
