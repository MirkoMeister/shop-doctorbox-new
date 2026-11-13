import type { Metadata } from "next";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { MiraAvatar } from "@/components/assistant/MiraAvatar";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight } from "@/components/ui/Icons";
import { CONTACT_EMAIL, CONTACT_PHONE, FAQ_PAGE, faqCopy } from "@/content/faq";
import { absoluteUrl, localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = faqCopy(locale);
  return pageMetadata(locale, FAQ_PAGE, { title: t.metaTitle, description: t.metaDescription });
}

/**
 * FAQ by topic: jump chips (a sticky list on desktop), one accordion per topic, then Mira and contact.
 * Replaces the Shopify page "FAQ Heimtests", which only listed questions without answers.
 */
export default async function FaqPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = faqCopy(locale);
  const href = (path: string) => localeHref(locale, path);
  const all = t.groups.flatMap((g) => g.items);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <JsonLd
        data={[
          faqJsonLd(all),
          breadcrumbJsonLd([
            { name: dict.common.home, url: absoluteUrl(locale, "/") },
            { name: t.kicker, url: absoluteUrl(locale, FAQ_PAGE) },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: dict.common.home, href: href("/") }, { label: t.kicker }]} className="mb-5" />

      <header className="max-w-2xl">
        <h1 className="h1 text-balance">
          <Highlight text={t.title} />
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{t.lead}</p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label={t.jump} className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-sm font-medium text-ink-muted">{t.jump}</p>
          <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {t.groups.map((g) => (
              <li key={g.key}>
                <a
                  href={`#faq-${g.key}`}
                  className="chip chip-outline hover:bg-lind lg:!flex lg:!rounded-xl lg:!border-transparent lg:!px-3 lg:!py-2 lg:hover:!bg-lind"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-3xl">
          {t.groups.map((g, i) => (
            <section key={g.key} id={`faq-${g.key}`} className={`scroll-mt-24 ${i > 0 ? "mt-12" : ""}`} aria-labelledby={`faq-${g.key}-title`}>
              <h2 id={`faq-${g.key}-title`} className="h3">
                {g.title}
              </h2>
              <Accordion
                className="mt-4"
                items={g.items.map((f) => ({
                  title: f.q,
                  content: (
                    <>
                      <p>{f.a}</p>
                      {f.link && (
                        <Link href={href(f.link.href)} className="mt-3 inline-flex items-center gap-1.5 font-medium text-green hover:underline">
                          {f.link.label} <ArrowRight width={14} height={14} />
                        </Link>
                      )}
                    </>
                  ),
                }))}
              />
            </section>
          ))}

          <section className="mt-16 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-8" aria-labelledby="faq-more">
            <div className="flex items-start gap-4">
              <MiraAvatar size={48} className="hidden shrink-0 ring-2 ring-white sm:inline-flex" />
              <div>
                <h2 id="faq-more" className="h4">
                  <Highlight text={t.moreTitle} />
                </h2>
                <p className="mt-1 max-w-xl text-moss/80">{t.moreText}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <AskMiraButton label={t.mira} className="btn btn-primary" />
                  <Link href={href("/pages/kontakt")} className="btn btn-secondary">
                    {t.contact}
                  </Link>
                </div>
                <p className="mt-5 text-sm text-moss/80">
                  {t.email}:{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-moss underline underline-offset-2">
                    {CONTACT_EMAIL}
                  </a>
                  <span className="mx-2" aria-hidden>
                    ·
                  </span>
                  {t.phone}:{" "}
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="font-medium text-moss underline underline-offset-2">
                    {CONTACT_PHONE}
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
