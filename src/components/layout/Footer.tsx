import { GUIDE_BASE } from "@/lib/content/guides";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Collection } from "@/lib/shopify/types";
import { NewsletterForm } from "./NewsletterForm";
import { PinIcon } from "@/components/ui/Icons";
import { APP_STORE_URL, PLAY_STORE_URL, REGISTER_TEST_URL } from "@/lib/links";

export function Footer({
  locale,
  dict,
  collections,
}: {
  locale: Locale;
  dict: Dictionary;
  collections: Collection[];
}) {
  const href = (p: string) => localeHref(locale, p);
  const year = new Date().getFullYear();

  const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
    {
      title: dict.footer.shop,
      links: [
        { label: dict.collection.all, href: href("/collections") },
        ...collections.slice(0, 6).map((c) => ({ label: c.title, href: href(`/collections/${c.handle}`) })),
        { label: dict.nav.builder, href: href("/pages/eigener-test") },
      ],
    },
    {
      title: dict.footer.help,
      links: [
        { label: dict.nav.faq, href: href("/pages/faqs") },
        { label: dict.nav.tasso, href: href("/pages/tasso") },
        { label: dict.nav.pharmacies, href: href("/pages/apotheken") },
        { label: dict.nav.results, href: href("/pages/mein-testergebnis") },
        { label: dict.nav.registerTest, href: REGISTER_TEST_URL, external: true },
        { label: dict.footer.payment, href: href("/pages/zahlung") },
        { label: dict.footer.shipping, href: href("/policies/shipping-policy") },
        { label: dict.footer.disposal, href: href("/pages/disposal") },
        { label: dict.nav.contact, href: href("/pages/kontakt") },
      ],
    },
    {
      title: dict.footer.company,
      links: [
        { label: dict.nav.about, href: href("/pages/uber-uns") },
        { label: dict.nav.blog, href: href("/blog") },
        { label: dict.nav.guide, href: href(GUIDE_BASE) },
        { label: dict.footer.b2b, href: href("/pages/b2b") },
        { label: "Trusted Shops", href: href("/pages/das-sagen-unsere-kunden") },
      ],
    },
    {
      title: dict.footer.legal,
      links: [
        { label: dict.footer.imprint, href: href("/policies/legal-notice") },
        { label: dict.footer.privacy, href: href("/policies/privacy-policy") },
        { label: dict.footer.terms, href: href("/policies/terms-of-service") },
        { label: dict.footer.refund, href: href("/policies/refund-policy") },
        { label: dict.footer.subscriptionPolicy, href: href("/policies/subscription-policy") },
        { label: dict.footer.cookies, href: "#iubenda-cs-preferences" },
      ],
    },
  ];

  return (
    <footer className="mt-24 bg-moss text-soft">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Image src="/brand/logo-white.svg" alt="DoctorBox" width={64} height={56} className="h-14 w-auto" />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-soft/80">{dict.meta.defaultDescription}</p>
            <p className="mt-5 flex items-start gap-2 text-sm text-soft/80">
              <PinIcon width={18} height={18} className="mt-0.5 shrink-0 text-turquoise" />
              {dict.footer.pickup}
            </p>
            <div className="mt-8">
              <h3 className="font-semibold">{dict.footer.newsletterTitle}</h3>
              <p className="mt-1 text-sm text-soft/70">{dict.footer.newsletterText}</p>
              <NewsletterForm dict={dict} locale={locale} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-turquoise">{col.title}</h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a href={l.href} target="_blank" rel="noopener" className="text-[0.95rem] text-soft/85 hover:text-white">
                          {l.label}
                        </a>
                      ) : l.href.startsWith("#") ? (
                        <a href={l.href} className="iubenda-cs-preferences-link text-[0.95rem] text-soft/85 hover:text-white">
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className="text-[0.95rem] text-soft/85 hover:text-white">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-soft/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} DoctorBox GmbH. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-3">
            <a href={APP_STORE_URL} target="_blank" rel="noopener" className="hover:text-white">
              App Store
            </a>
            <span aria-hidden>·</span>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener" className="hover:text-white">
              Google Play
            </a>
          </div>
        </div>
        <p className="mt-4 text-xs text-soft/50">{dict.footer.medical}</p>
      </div>
    </footer>
  );
}
