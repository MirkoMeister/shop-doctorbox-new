import Script from "next/script";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { TRACKING } from "@/lib/tracking/config";
import { RouteTracker } from "./RouteTracker";

/**
 * Consent (iubenda) + tracking, following the tracking brief for the headless shop.
 *
 * 1. iubenda loads first (beforeInteractive, rendered by the root layout): our configuration (look of the
 *    old theme; it takes precedence over the dashboard settings), then the embed with autoblocking and
 *    banner. The visitor's choice is passed on to Shopify's Customer Privacy API so the checkout
 *    (Meta, Google and Reddit apps) respects it.
 * 2. Every tag waits for consent ("prior blocking"): rendered as type="text/plain" and swapped
 *    for a live script by iubenda (class _iub_cs_activate[-inline] + data-iub-purposes).
 *    Purpose 4 = measurement (GTM), purpose 5 = marketing (Meta, Reddit, Klaviyo).
 * 3. Without consent only Plausible (cookieless) and the Trusted Shops widget load.
 *
 * E-commerce events: src/lib/tracking/events.ts
 */
/** Inline iubenda configuration (old theme settings + hand-over of the choice to Shopify) */
export function iubendaConfigScript(locale: Locale): string {
  const t = TRACKING;
  const checkoutDomain = process.env.SHOPIFY_ONLINE_STORE_DOMAIN || "doctorbox-heimtests.myshopify.com";
  // Public Storefront API token (the one meant for browsers); the Customer Privacy API needs it
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

  const banner: Record<string, unknown> = {
    acceptButtonDisplay: true,
    rejectButtonDisplay: true,
    customizeButtonDisplay: true,
    position: "float-bottom-left",
    backgroundOverlay: false,
    fontSize: "14px",
    logo: "/consent-logo.png",
    brandTextColor: "#000000",
    brandBackgroundColor: "#ffffff",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    acceptButtonColor: "#0C432A",
    acceptButtonCaptionColor: "#ffffff",
    rejectButtonColor: "#0C432A",
    rejectButtonCaptionColor: "#ffffff",
    customizeButtonColor: "#0C432A",
    customizeButtonCaptionColor: "#ffffff",
    ownerName: "DoctorBox Service GmbH",
  };
  if (locale === "de") banner.customizeButtonCaption = "Einstellungen anzeigen";

  const config = {
    siteId: Number(t.iubendaSiteId),
    cookiePolicyId: Number(t.iubendaPolicyIds[locale] || t.iubendaPolicyIds.de),
    // The iubenda plan only covers the languages it has a cookie policy for; without an English
    // policy the banner would not appear at all on /en, so it falls back to German there
    lang: t.iubendaPolicyIds[locale] ? locale : "de",
    storage: { useSiteId: true },
    consentOnContinuedBrowsing: false,
    perPurposeConsent: true,
    countryDetection: true,
    enableGdpr: true,
    enableUspr: false,
    enableCcpa: false,
    enableLgpd: false,
    googleConsentMode: true,
    uetConsentMode: true,
    enableTcf: false,
    cookiePolicyInOtherWindow: true,
    cookiePolicyUrl: localeHref(locale, "/pages/cookies"),
    privacyPolicyUrl: localeHref(locale, "/policies/privacy-policy"),
    floatingPreferencesButtonDisplay: "anchored-bottom-left",
    promptToAcceptOnBlockedElements: true,
    banner,
  };

  // Hand the choice to Shopify (headless variant of the old theme's setTrackingConsent call)
  const iubendaConfig = `var _iub = _iub || [];
(function () {
  var shopify = ${JSON.stringify({ checkoutRootDomain: checkoutDomain, storefrontAccessToken: storefrontToken })};
  function rootDomain() { var h = location.hostname; return /(^|\\.)doctorbox\\.de$/.test(h) ? "doctorbox.de" : h; }
  function toShopify(prefs) {
    if (!shopify.storefrontAccessToken) return;
    var consent = prefs && prefs.purposes ? prefs : (_iub.cs && _iub.cs.api ? _iub.cs.api.getPreferences() : {});
    var p = (consent && consent.purposes) || {};
    var choice = { analytics: p[4] === true, marketing: p[5] === true, preferences: p[2] === true || p[3] === true, sale_of_data: true,
      headlessStorefront: true, checkoutRootDomain: shopify.checkoutRootDomain, storefrontRootDomain: rootDomain(),
      storefrontAccessToken: shopify.storefrontAccessToken };
    function send() { try { window.Shopify.customerPrivacy.setTrackingConsent(choice, function () {}); } catch (e) {} }
    if (window.Shopify && window.Shopify.customerPrivacy) return send();
    var s = document.createElement("script");
    s.src = "https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.2/consent-tracking-api.js";
    s.async = true; s.onload = send; document.head.appendChild(s);
  }
  var config = ${JSON.stringify(config)};
  config.callback = { onPreferenceExpressedOrNotNeeded: toShopify };
  _iub.csConfiguration = config;
})();`;

  return iubendaConfig;
}

/** iubenda embed (autoblocking + banner) right after the inline configuration, before every other script */
export function iubendaEmbedSrc() {
  return `https://embeds.iubenda.com/widgets/${TRACKING.iubendaEmbedId}.js`;
}

export function Analytics() {
  const t = TRACKING;
  // Meta pixel: PageView on activation, then the events queued before consent (ViewContent, AddToCart)
  const metaPixel = `!function(b,e,v){var t=b.createElement(e);t.async=!0;t.src=v;var s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${t.metaPixelId}');fbq('track','PageView');
window.__dbxMeta=true;(window.__dbxMetaQ||[]).splice(0).forEach(function(a){fbq.apply(null,a)});`;

  // Reddit pixel (standard snippet) with the same queue handling
  const redditPixel = `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
rdt('init','${t.redditPixelId}');rdt('track','PageVisit');
window.__dbxReddit=true;(window.__dbxRedditQ||[]).splice(0).forEach(function(a){rdt.apply(null,a)});`;

  const gtm = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${t.gtmId}');`;

  return (
    <>
      {/* The GTM container calls fbq(): Meta's standard stub queues those calls until the pixel runs.
          The stub itself sends nothing. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "!function(f,n){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);",
        }}
      />

      {/* 2. Tags, inert until consent */}
      {t.gtmId && (
        <script type="text/plain" className="_iub_cs_activate-inline" data-iub-purposes="4" dangerouslySetInnerHTML={{ __html: gtm }} />
      )}
      {t.metaPixelId && (
        <script type="text/plain" className="_iub_cs_activate-inline" data-iub-purposes="5" dangerouslySetInnerHTML={{ __html: metaPixel }} />
      )}
      {t.redditPixelId && (
        <script type="text/plain" className="_iub_cs_activate-inline" data-iub-purposes="5" dangerouslySetInnerHTML={{ __html: redditPixel }} />
      )}
      {t.klaviyoCompanyId && (
        <script
          type="text/plain"
          className="_iub_cs_activate"
          data-suppressedsrc={`https://static.klaviyo.com/onsite/js/${t.klaviyoCompanyId}/klaviyo.js?company_id=${t.klaviyoCompanyId}`}
          data-iub-purposes="5"
          async
        />
      )}

      {/* 3. Without consent: Plausible (cookieless, no personal data) and the Trusted Shops review widget */}
      {t.plausibleDomain && <Script defer data-domain={t.plausibleDomain} src="https://plausible.io/js/script.js" strategy="lazyOnload" />}
      {t.etrusted && <Script src="https://integrations.etrusted.com/applications/widget.js/v2" strategy="lazyOnload" />}

      <RouteTracker />
    </>
  );
}
