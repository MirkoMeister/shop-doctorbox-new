import type { Metadata } from "next";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight, MailIcon, PhoneIcon, PinIcon, SparkIcon } from "@/components/ui/Icons";
import { CONTACT, CONTACT_COPY } from "@/content/contact";
import { localeHref } from "@/lib/i18n/config";
import { SOCIAL_LINKS } from "@/lib/links";
import { resolveLocale } from "@/lib/locale-params";
import { JsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = CONTACT_COPY[locale];
  return pageMetadata(locale, "/pages/kontakt", { title: t.metaTitle, description: t.metaDescription });
}

export default async function ContactPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = CONTACT_COPY[locale];
  const href = (p: string) => localeHref(locale, p);

  const quick = [
    { label: t.quick.faq, href: href("/pages/faqs") },
    { label: t.quick.result, href: href("/pages/mein-testergebnis") },
    { label: t.quick.shipping, href: href("/policies/shipping-policy") },
    { label: t.quick.refund, href: href("/policies/refund-policy") },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: t.metaTitle,
          mainEntity: {
            "@type": "Organization",
            name: CONTACT.company,
            email: CONTACT.email,
            telephone: CONTACT.phone,
            address: { "@type": "PostalAddress", streetAddress: CONTACT.street, postalCode: CONTACT.city.split(" ")[0], addressLocality: "Berlin", addressCountry: "DE" },
          },
        }}
      />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pt-8">
        <Breadcrumbs items={[{ label: dict.common.home, href: href("/") }, { label: t.kicker }]} className="mb-6" />

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-green">{t.kicker}</p>
          <h1 className="h1 mt-2 text-balance">
            <Highlight text={t.headline} />
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t.lead}</p>
        </header>

        {/* Contact channels */}
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          <li className="flex flex-col rounded-[var(--radius-card)] border border-line/70 bg-white p-6 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lind text-moss">
              <MailIcon width={20} height={20} />
            </span>
            <h2 className="h4 mt-4">{t.cards.email.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{t.cards.email.text}</p>
            <a href={`mailto:${CONTACT.email}`} className="mt-auto inline-flex items-center gap-1.5 pt-4 font-semibold text-green hover:underline">
              {CONTACT.email}
            </a>
          </li>
          <li className="flex flex-col rounded-[var(--radius-card)] border border-line/70 bg-white p-6 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lind text-moss">
              <PhoneIcon width={20} height={20} />
            </span>
            <h2 className="h4 mt-4">{t.cards.phone.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{t.cards.phone.text}</p>
            <a href={CONTACT.phoneHref} className="mt-auto inline-flex items-center gap-1.5 pt-4 font-semibold tabular-nums text-green hover:underline">
              {CONTACT.phone}
            </a>
          </li>
          <li className="flex flex-col rounded-[var(--radius-card)] bg-moss p-6 text-soft shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-turquoise">
              <PinIcon width={20} height={20} />
            </span>
            <h2 className="h4 mt-4">{t.cards.pickup.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-soft/80">{t.cards.pickup.text}</p>
            <address className="mt-4 text-sm not-italic leading-relaxed">
              {CONTACT.company}
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </address>
            <a href={CONTACT.mapsUrl} target="_blank" rel="noopener" className="mt-auto inline-flex items-center gap-1.5 pt-4 font-semibold text-turquoise hover:underline">
              {t.cards.pickup.cta} <ArrowRight width={16} height={16} />
            </a>
          </li>
        </ul>

        {/* Quick help */}
        <section className="mt-12 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-moss sm:flex">
                <SparkIcon width={22} height={22} />
              </span>
              <div>
                <h2 className="h4">{t.quickTitle}</h2>
                <p className="mt-1 max-w-xl text-moss/80">{t.quick.miraText}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {quick.map((q) => (
                    <li key={q.href}>
                      <Link href={q.href} className="chip chip-outline !border-moss/30 !bg-white/60 hover:!bg-white">
                        {q.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <AskMiraButton label={t.quick.mira} className="btn btn-primary lg:justify-self-end" />
          </div>
        </section>

        {/* Form */}
        <section className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16" aria-labelledby="contact-form">
          <div>
            <h2 id="contact-form" className="h2">
              {t.formTitle}
            </h2>
            <p className="mt-3 text-ink-muted">{t.formText}</p>
            <h3 className="mt-10 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">{t.socialTitle}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener" className="chip chip-outline hover:bg-lind">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line/70 bg-white p-6 shadow-card sm:p-8">
            <ContactForm locale={locale} t={t.form} />
          </div>
        </section>
      </div>
    </>
  );
}
