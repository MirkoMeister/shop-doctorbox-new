/**
 * Bundle offers on product pages: product handle → bundle handle. The box under the add-to-cart
 * button shows the bundle with its saving against buying the single test twice. Bundles stay
 * reachable by link but are left out of the overview, search, recommendations and the sitemap.
 */
export const BUNDLE_OFFERS: Record<string, string> = {
  "sti-pro-10": "sti-pro-paar-bundle",
};

/** sold only through the offer box (and their own link), not listed anywhere else */
export const UNLISTED_HANDLES = Object.values(BUNDLE_OFFERS);
