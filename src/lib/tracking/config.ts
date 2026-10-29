/**
 * Public tracking IDs. They are visible in every page's HTML anyway, so the values from the old
 * Shopify theme are the defaults; an env variable overrides each one (e.g. for a test container).
 */
export const TRACKING = {
  iubendaSiteId: process.env.NEXT_PUBLIC_IUBENDA_SITE_ID || "4285414",
  iubendaPolicyIds: {
    de: process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID_DE || "15435559",
    en: process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID_EN || "89101442",
  },
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-N3DHSDL",
  /** Same pixel as the Shopify "Facebook & Instagram" app (that app keeps sending Purchase from checkout) */
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "725119135330052",
  redditPixelId: process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID || "a2_jjo8ujxv6gt2",
  klaviyoCompanyId: process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID || "XHvpRp",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
  etrusted: process.env.NEXT_PUBLIC_ETRUSTED_ENABLED === "true",
} as const;
