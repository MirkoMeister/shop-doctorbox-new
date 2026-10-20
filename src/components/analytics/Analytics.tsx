import Script from "next/script";
import type { Locale } from "@/lib/i18n/config";

/**
 * Consent (iubenda) + tracking. Everything the old shop loaded is kept:
 *  - iubenda CMP with autoblocking (blocks GTM/Klaviyo until consent)
 *  - Google Tag Manager (GA4, Meta, TikTok and Clarity are configured inside the container)
 *  - Klaviyo onsite
 *  - Plausible (cookieless)
 *  - Trusted Shops / eTrusted widget bootstrap
 */
export function Analytics({ locale }: { locale: Locale }) {
  const siteId = process.env.NEXT_PUBLIC_IUBENDA_SITE_ID;
  const policyId =
    locale === "en" ? process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID_EN : process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID_DE;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const klaviyo = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const etrusted = process.env.NEXT_PUBLIC_ETRUSTED_ENABLED === "true";
  const metaPixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {siteId && policyId && (
        <>
          <Script id="iubenda-config" strategy="afterInteractive">
            {`var _iub = _iub || [];
_iub.csConfiguration = {
  siteId: ${siteId},
  cookiePolicyId: ${policyId},
  lang: "${locale}",
  storage: { useSiteId: true },
  perPurposeConsent: true,
  floatingPreferencesButtonDisplay: false,
  banner: {
    acceptButtonDisplay: true,
    customizeButtonDisplay: true,
    rejectButtonDisplay: true,
    position: "float-bottom-center",
    backgroundColor: "#0E4D2F",
    textColor: "#F7F1E9",
    acceptButtonColor: "#0E834B",
    acceptButtonCaptionColor: "#FFFFFF",
    customizeButtonColor: "#CBDFC6",
    customizeButtonCaptionColor: "#0E4D2F",
    rejectButtonColor: "#0E4D2F",
    rejectButtonCaptionColor: "#F7F1E9",
    closeButtonDisplay: false
  }
};`}
          </Script>
          <Script src={`https://cs.iubenda.com/autoblocking/${siteId}.js`} strategy="afterInteractive" />
          <Script src="https://cdn.iubenda.com/cs/iubenda_cs.js" strategy="afterInteractive" />
        </>
      )}

      {gtm && (
        <Script id="gtm" strategy="afterInteractive" data-iub-purposes="4,5">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}

      {/* The GTM container calls fbq() – make sure the function exists before GTM runs, even without a pixel ID.
          Calls are queued and flushed once the real pixel loads (Meta's standard stub). */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "!function(f,n){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);",
        }}
      />
      {/* Meta base pixel: loads the real script and initialises the pixel when an ID is configured */}
      {metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive" data-iub-purposes="5">
          {`!function(b,e,v){var t=b.createElement(e);t.async=!0;t.src=v;var s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}

      {klaviyo && (
        <Script
          src={`https://static.klaviyo.com/onsite/js/${klaviyo}/klaviyo.js?company_id=${klaviyo}`}
          strategy="lazyOnload"
          data-iub-purposes="5"
        />
      )}

      {plausible && <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="lazyOnload" />}

      {etrusted && <Script src="https://integrations.etrusted.com/applications/widget.js/v2" strategy="lazyOnload" />}
    </>
  );
}
