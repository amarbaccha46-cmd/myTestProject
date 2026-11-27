// trim-session.js
// Usage: node trim-session.js session24.json gemini-session-6.json
const fs = require("fs");

const inFile = process.argv[2];
const outFile = process.argv[3];

if (!inFile || !outFile) {
  console.log("Use: node trim-session.js <input.json> <output.json>");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inFile, "utf8"));

const keep = (url) =>
  /(^|\.)google\.com$|(^|\.)gstatic\.com$|(^|\.)googleusercontent\.com$/.test(
    new URL(url).hostname,
  );

const trimmed = {
  cookies: (raw.cookies || []).filter((c) =>
    /\.?google\.com$|\.?gstatic\.com$|\.?googleusercontent\.com$/.test(
      c.domain,
    ),
  ),
  origins: (raw.origins || []).filter((o) => keep(o.origin)),
};

fs.writeFileSync(outFile, JSON.stringify(trimmed, null, 2));
console.log(
  `Trimmed. Cookies: ${trimmed.cookies.length}, Origins: ${trimmed.origins.length}`,
);
console.log(`Saved: ${outFile}`);
