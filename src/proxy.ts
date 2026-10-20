import { NextResponse, type NextRequest } from "next/server";
import { GUIDE_BASE, GUIDE_INDEX_PAGES, isGuidePage } from "@/lib/content/guides";

/**
 * URL strategy (mirrors the old Shopify store so rankings carry over):
 *  - German is the default and has no prefix:      /products/x
 *  - English lives under /en:                       /en/products/x
 *  - /de-at and /en-at (old market URLs) → 301 to the plain locale
 *  - editorial content moved to /ratgeber/<slug>:
 *      /blogs/<blog>/<slug> → /ratgeber/<slug>,  /blogs/<blog> → /ratgeber?thema=<blog>
 *      /pages/<guide>       → /ratgeber/<guide>  (utility pages stay at /pages/)
 *  - internal routing happens under /[locale], so "/" is rewritten to "/de"
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Static files, Next internals and API routes pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
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
  };
  if (legacy[bare]) return redirect(`${prefix}${legacy[bare]}`);

  // Blog → Ratgeber
  const article = bare.match(/^\/blogs\/[^/]+\/([^/]+)\/?$/);
  if (article) return redirect(`${prefix}${GUIDE_BASE}/${article[1]}`, false);
  const blog = bare.match(/^\/blogs\/([^/]+)\/?$/);
  if (blog) return redirect(`${prefix}${GUIDE_BASE}?thema=${blog[1]}`, false);

  // Guide pages → Ratgeber (utility pages keep /pages/)
  const page = bare.match(/^\/pages\/([^/]+)\/?$/);
  if (page) {
    const handle = decodeURIComponent(page[1]);
    if (GUIDE_INDEX_PAGES.has(handle)) return redirect(`${prefix}${GUIDE_BASE}`, false);
    if (isGuidePage(handle)) return redirect(`${prefix}${GUIDE_BASE}/${handle}`, false);
  }

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
