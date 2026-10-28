import { NextResponse, type NextRequest } from "next/server";
import { BLOG_BASE, GUIDE_BASE } from "@/lib/content/guides";

/**
 * URL strategy (mirrors the old Shopify store so rankings carry over):
 *  - German is the default and has no prefix:      /products/x
 *  - English lives under /en:                       /en/products/x
 *  - /de-at and /en-at (old market URLs) → 301 to the plain locale
 *  - editorial content keeps the Shopify URLs (/blogs/<blog>/<slug>, /pages/<handle>);
 *    the short preview URLs (/ratgeber/<slug>, /blog/<slug>) 301 to them and
 *    /pages/gesundheitsblog → /blog (overview across all blogs)
 *  - internal routing happens under /[locale], so "/" is rewritten to "/de"
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Static files, Next internals and API routes pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/brand") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const redirect = (to: string, keepSearch = true) => {
    const url = request.nextUrl.clone();
    const [path, qs] = to.split("?");
    url.pathname = path || "/";
    url.search = qs ? `?${qs}` : keepSearch ? search : "";
    return NextResponse.redirect(url, 301);
  };

  // Old market prefixes and an explicit /de prefix
  for (const [from, to] of [
    ["/de-at", ""],
    ["/en-at", "/en"],
    ["/de", ""],
  ] as const) {
    if (pathname === from || pathname.startsWith(`${from}/`)) {
      const rest = pathname.slice(from.length);
      return redirect(`${to}${rest}` || "/");
    }
  }

  // Split locale prefix for the content redirects below
  const en = pathname === "/en" || pathname.startsWith("/en/");
  const prefix = en ? "/en" : "";
  const bare = en ? pathname.slice(3) || "/" : pathname;

  // Legacy paths
  const legacy: Record<string, string> = {
    "/collections/all": "/collections",
    "/pages/unsere-heimtests": "/collections",
    // Italian market was not carried over: its collection and blog point to the German sexual-health content
    "/collections/salute-sessuale": "/collections/sexuelle-gesundheit",
    "/blogs/blog-salute-sessuale": "/blogs/blog-sexuelle-gesundheit",
    // translated blog handle from the old English sitemap
    "/blogs/blog-sexual-health": "/blogs/blog-sexuelle-gesundheit",
  };
  if (legacy[bare]) return redirect(`${prefix}${legacy[bare]}`);
  const legacyBlog = bare.match(/^\/blogs\/(blog-salute-sessuale|blog-sexual-health)\/[^/]+\/?$/);
  if (legacyBlog) return redirect(`${prefix}/blogs/blog-sexuelle-gesundheit`, false);

  // Short preview URLs → the canonical Shopify URLs
  if (bare === "/pages/gesundheitsblog") return redirect(`${prefix}${BLOG_BASE}`, false);
  if (bare === "/ratgeber" || bare === "/ratgeber/") return redirect(`${prefix}${GUIDE_BASE}`, false);
  const guide = bare.match(/^\/ratgeber\/([^/]+)\/?$/);
  if (guide) return redirect(`${prefix}/pages/${guide[1]}`, false);

  // English: already prefixed, just continue
  if (en) return NextResponse.next();

  // German: rewrite internally to /de/...
  const url = request.nextUrl.clone();
  url.pathname = `/de${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
