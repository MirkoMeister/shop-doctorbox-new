/**
 * Multi-buy offers on product pages: from two of this test on, the automatic Shopify discount named
 * here takes a percentage off every kit. The percentage is measured from Shopify (lib/shopify/multi-buy.ts),
 * so changing the discount in Shopify is enough; without an active discount the box disappears.
 */
export const MULTI_BUY: Record<string, { discount: string }> = {
  "sti-pro-10": { discount: "STI Pro zu zweit" },
  "sti-standard-5": { discount: "STI Standard zu zweit" },
  "sti-test-1": { discount: "STI Basic zu zweit" },
  "sti-test": { discount: "STI Essential zu zweit" },
};

/**
 * Sold only by link, left out of the overview, collections, search, recommendations and the sitemap.
 * The Paar-Bundle product is replaced by the multi-buy discount; delete it here once it is gone in Shopify.
 */
export const UNLISTED_HANDLES = ["sti-pro-paar-bundle"];
