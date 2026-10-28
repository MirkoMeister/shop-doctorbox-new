// Checks the Trusted Shops API credentials: token, channels, and product reviews for one SKU.
// usage: node scripts/etrusted-check.mjs [SKU]   (reads .env.local)
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const sku = process.argv[2] ?? "STIPROM";
const tok = await fetch("https://login.etrusted.com/oauth/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: env.ETRUSTED_CLIENT_ID ?? "", client_secret: env.ETRUSTED_CLIENT_SECRET ?? "", grant_type: "client_credentials", audience: "https://api.etrusted.com" }) });
console.log("token:", tok.status);
if (!tok.ok) { console.log(await tok.text()); process.exit(1); }
const { access_token } = await tok.json();
const h = { Authorization: `Bearer ${access_token}`, Accept: "application/json" };
const ch = await fetch("https://api.etrusted.com/channels", { headers: h });
console.log("channels:", ch.status, ch.ok ? (await ch.json()).map((c) => `${c.id} ${c.name} (${c.locale})`) : await ch.text());
const rv = await fetch(`https://api.etrusted.com/reviews?type=PRODUCT_REVIEW&status=APPROVED&count=5&sku=${encodeURIComponent(sku)}`, { headers: h });
const data = rv.ok ? await rv.json() : await rv.text();
console.log(`reviews for ${sku}:`, rv.status, typeof data === "string" ? data : data.items.map((r) => `${r.rating}★ ${r.submittedAt.slice(0, 10)} ${r.product?.sku} "${(r.title ?? r.comment ?? "").slice(0, 60)}"`));
const all = await fetch("https://api.etrusted.com/reviews/count?type=PRODUCT_REVIEW&status=APPROVED", { headers: h });
console.log("approved product reviews total:", all.status, all.ok ? await all.text() : "");
