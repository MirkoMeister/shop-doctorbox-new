import { NextResponse, type NextRequest } from "next/server";
import { clientIp } from "@/lib/rate-limit";
import { TRACKING } from "@/lib/tracking/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Storefront API proxy for Shopify's visitor cookies (_shopify_analytics, _shopify_marketing,
 * _shopify_essential; they replace _shopify_y/_shopify_s), as Shopify recommends for custom headless
 * storefronts. Shopify sets them only in a response through the storefront's own domain; without them
 * the Customer Privacy API makes up new visitor/session tokens on every page load.
 *
 * Only the one cookie query is forwarded; this is not a general Storefront API proxy. Shopify decides
 * from the visitor's consent cookie (_tracking_consent) what to set; the browser only asks after consent
 * to measurement. The answer carries the visitor's stable tokens (shopifyUnique/shopifyVisit), which the
 * browser side (lib/tracking/shopify.ts) puts into its events.
 */

const QUERY = "query ensureCookies { consentManagement { cookies(visitorConsent:{}) { trackingConsentCookie cookieDomain shopifyUnique shopifyVisit } } }";
const norm = (q: string) => q.replace(/\s+/g, "");

const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
/** the online store domain, so Shopify answers with cookies for doctorbox.de (shop and checkout) */
const upstream = `https://${TRACKING.shopifyCheckoutDomain}/api/unstable/graphql.json`;

/** Shopify's cookies sent along: its visitor cookies, and the consent cookie it decides by */
const shopifyCookie = (name: string) => name.startsWith("_shopify") || name === "_tracking_consent";
/**
 * Only the visitor cookies come back (HttpOnly, shop.doctorbox.de). Shopify would also delete
 * _tracking_consent and set _shopify_cmp instead; the consent handover (iubenda → setTrackingConsent
 * in Analytics.tsx) stays as it is, so those two are not passed on.
 */
const VISITOR_COOKIES = new Set(["_shopify_essential", "_shopify_analytics", "_shopify_marketing"]);
const tokenOk = (v: string | null) => !!v && /^[A-Za-z0-9._-]{8,100}$/.test(v);

export async function POST(req: NextRequest) {
  let body: { query?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (typeof body.query !== "string" || norm(body.query) !== norm(QUERY)) {
    return NextResponse.json({ error: "not allowed" }, { status: 403 });
  }
  if (!token && !privateToken) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Shopify-Storefront-Consent-Management": "1",
    ...(privateToken ? { "Shopify-Storefront-Private-Token": privateToken } : { "X-Shopify-Storefront-Access-Token": token! }),
  };
  const ip = clientIp(req.headers);
  if (privateToken && ip) headers["Shopify-Storefront-Buyer-IP"] = ip;
  const visit = req.headers.get("x-shopify-visittoken");
  const unique = req.headers.get("x-shopify-uniquetoken");
  if (tokenOk(visit)) headers["X-Shopify-VisitToken"] = visit!;
  if (tokenOk(unique)) headers["X-Shopify-UniqueToken"] = unique!;
  const cookie = req.cookies
    .getAll()
    .filter((c) => shopifyCookie(c.name))
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  if (cookie) headers.Cookie = cookie;

  let res: Response;
  try {
    res = await fetch(upstream, { method: "POST", headers, body: JSON.stringify({ query: QUERY }), cache: "no-store" });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  const out = new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
  for (const c of res.headers.getSetCookie()) {
    if (VISITOR_COOKIES.has(c.split("=")[0].trim())) out.headers.append("Set-Cookie", c);
  }
  return out;
}
