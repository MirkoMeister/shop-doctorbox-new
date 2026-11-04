import { NextResponse, type NextRequest } from "next/server";
import { CART_COOKIE, DISCOUNT_COOKIE, DISCOUNT_COOKIE_MAX_AGE, isLinkCode, safeRedirect } from "@/lib/cart/discount-link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { clientIp, rateLimiter } from "@/lib/rate-limit";
import { updateCartDiscountCodes } from "@/lib/shopify/queries";

/** links can be used to guess codes like the cart field: same limit */
const limited = rateLimiter({ windowMs: 10 * 60 * 1000, perKey: 10 });

/**
 * /discount/CODE (and /en/discount/CODE), as on the old Shopify store: remembers the code, applies it to an
 * existing cart and sends the visitor on to ?redirect= (a path on this site) or the home page.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ locale: string; code: string }> }) {
  const p = await params;
  const locale: Locale = isLocale(p.locale) ? p.locale : "de";
  const code = decodeURIComponent(p.code).trim();
  const home = locale === "en" ? "/en" : "/";
  const target = safeRedirect(request.nextUrl.searchParams.get("redirect"), home);

  // relative Location: behind the Scalingo router the request URL carries the internal host
  const res = new NextResponse(null, { status: 302, headers: { Location: target } });
  if (!isLinkCode(code)) return res;

  res.cookies.set(DISCOUNT_COOKIE, code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DISCOUNT_COOKIE_MAX_AGE,
  });

  const cartId = request.cookies.get(CART_COOKIE)?.value;
  const ip = clientIp(request.headers);
  if (cartId && !limited(ip ?? "local")) {
    // a failing or unknown code must not block the redirect; Shopify ignores codes that do not apply
    await updateCartDiscountCodes(cartId, [code], locale, ip).catch(() => null);
  }
  return res;
}
