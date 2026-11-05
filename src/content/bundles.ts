/**
 * Multi-buy offers on product pages: from two of this test on, the automatic Shopify discount named
 * here takes `percent` off every kit. The box under the add-to-cart button adds a second kit
 * (any variant, so a couple can mix urine and vaginal swab). Keep `percent` in step with Shopify.
 */
export const MULTI_BUY: Record<string, { percent: number; discount: string }> = {
  "sti-pro-10": { percent: 20, discount: "STI Pro zu zweit" },
  "sti-standard-5": { percent: 20, discount: "STI Standard zu zweit" },
  "sti-test-1": { percent: 20, discount: "STI Basic zu zweit" },
  "sti-test": { percent: 20, discount: "STI Essential zu zweit" },
};

/**
 * Sold only by link, left out of the overview, collections, search, recommendations and the sitemap.
 * The Paar-Bundle product is replaced by the multi-buy discount; delete it here once it is gone in Shopify.
 */
export const UNLISTED_HANDLES = ["sti-pro-paar-bundle"];
