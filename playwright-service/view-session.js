// view-session.js
// Usage: node view-session.js session24.json https://example.com
// Opens a browser logged in with the given session file. Saves nothing.
const { chromium } = require("playwright");
const fs = require("fs");

const file = process.argv[2];
const url = process.argv[3] || "about:blank";

if (!file) {
  console.log("Use: node view-session.js <file.json> [url]");
  process.exit(1);
}

(async () => {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const browser = await chromium.launch({ headless: false });

  const ctx = Array.isArray(raw)
    ? await browser.newContext()
    : await browser.newContext({ storageState: file });
  if (Array.isArray(raw)) await ctx.addCookies(raw);

  const page = await ctx.newPage();
  await page.goto(url);

  console.log(
    "Browser খুলেছে। দেখা শেষ হলে ব্রাউজার বন্ধ কর (কিছু সেভ হবে না).",
  );
  await new Promise((r) => browser.on("disconnected", r));
})();
