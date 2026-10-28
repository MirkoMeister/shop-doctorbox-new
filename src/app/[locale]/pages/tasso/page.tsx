import type { Metadata } from "next";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { ProductGrid } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { CheckIcon, DropIcon, LabIcon, ShieldIcon, SparkIcon } from "@/components/ui/Icons";
import { TASSO_PAGE, TASSO_POSTER, TASSO_VIDEO, tassoCopy } from "@/content/tasso";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { faqJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/queries";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = tassoCopy(locale);
  return pageMetadata(locale, TASSO_PAGE, { title: t.metaTitle, description: t.metaDescription, image: TASSO_POSTER });
}

/** Tasso+ landing: the painless upper-arm collection explained, with every test that offers it. */
export default async function TassoPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = tassoCopy(locale);
  const products = (await getAllProducts(locale).catch(() => [])).filter((p) => p.tasso);
  const icons = [SparkIcon, ShieldIcon, DropIcon, LabIcon];

  return (
    <>
      <JsonLd data={faqJsonLd(t.faq)} />
      {/* Hero with the product video */}
      <section data-hero="dark" className="relative -mt-[72px] overflow-hidden bg-moss text-soft lg:-mt-[88px]">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-[6.5rem] sm:px-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-center lg:px-8 lg:pb-24 lg:pt-[8.5rem]">
          <div>
            <Breadcrumbs
              items={[{ label: dict.common.home, href: localeHref(locale, "/") }, { label: "Tasso+" }]}
              className="mb-6 text-soft/70 [&_a]:text-soft/70 [&_a:hover]:text-soft"
            />
            <p className="text-sm font-medium text-turquoise">{t.kicker}</p>
            <h1 className="h-display mt-3 text-balance">
              <Highlight text={t.title} tone="dark" />
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-soft/85">{t.lead}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {t.facts.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-soft/90">
                  <CheckIcon width={16} height={16} className="shrink-0 text-turquoise" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#tests" className="btn btn-on-dark">
                {t.productsTitle.replace(/\[\[|\]\]/g, "")}
              </a>
              <AskMiraButton label={dict.collection.miraCta} className="btn btn-secondary !border-soft/60 !text-soft hover:!bg-white/10" />
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-[var(--radius-panel)] bg-moss-deep shadow-float">
            <video className="absolute inset-0 h-full w-full object-cover" src={TASSO_VIDEO} poster={TASSO_POSTER} autoPlay muted loop playsInline preload="metadata" aria-label={t.videoLabel} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Why */}
        <section className="mt-16" aria-labelledby="tasso-why">
          <h2 id="tasso-why" className="h2 max-w-xl text-balance">
            <Highlight text={t.whyTitle} />
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.why.map((w, i) => {
              const Icon = icons[i % icons.length];
              return (
                <li key={w.title} className="rounded-[var(--radius-card)] border border-line/70 bg-white p-6 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lind text-moss">
                    <Icon width={20} height={20} />
                  </span>
                  <h3 className="mt-4 font-semibold">{w.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">{w.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Steps */}
        <section className="mt-20 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-10" aria-labelledby="tasso-steps">
          <div className="max-w-2xl">
            <h2 id="tasso-steps" className="h2 text-balance">
              <Highlight text={t.stepsTitle} />
            </h2>
            <p className="mt-3 text-lg text-moss/80">{t.stepsText}</p>
          </div>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <li key={s.title} className="rounded-[var(--radius-card)] bg-white/70 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss text-sm font-semibold text-soft">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-moss/80">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Finger prick vs Tasso+ */}
        <section className="mt-20" aria-labelledby="tasso-compare">
          <div className="max-w-2xl">
            <h2 id="tasso-compare" className="h2 text-balance">
              <Highlight text={t.compareTitle} />
            </h2>
            <p className="mt-3 text-lg text-ink-muted">{t.compareText}</p>
          </div>
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card [contain:paint]">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line/70 text-left">
                  <th className="px-5 py-4 font-medium text-ink-muted">{t.compareHead[0]}</th>
                  <th className="px-5 py-4 font-semibold">{t.compareHead[1]}</th>
                  <th className="bg-lind/30 px-5 py-4 font-semibold text-moss">{t.compareHead[2]}</th>
                </tr>
              </thead>
              <tbody>
                {t.compare.map((row) => (
                  <tr key={row[0]} className="border-b border-line/50 last:border-0">
                    <th scope="row" className="px-5 py-3.5 text-left font-semibold">{row[0]}</th>
                    <td className="px-5 py-3.5 text-ink-muted">{row[1]}</td>
                    <td className="bg-lind/30 px-5 py-3.5 font-medium text-moss">
                      <span className="inline-flex items-start gap-2">
                        <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-green" />
                        {row[2]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Products */}
        {products.length > 0 && (
          <section id="tests" className="mt-20 scroll-mt-24" aria-labelledby="tasso-products">
            <div className="max-w-2xl">
              <h2 id="tasso-products" className="h2 text-balance">
                <Highlight text={t.productsTitle} />
              </h2>
              <p className="mt-3 text-lg text-ink-muted">{t.productsText}</p>
            </div>
            <div className="mt-8">
              <ProductGrid products={products} locale={locale} dict={dict} priorityCount={4} />
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-20" aria-labelledby="tasso-faq">
          <h2 id="tasso-faq" className="h2 max-w-xl text-balance">
            <Highlight text={t.faqTitle} />
          </h2>
          <Accordion className="mt-6" items={t.faq.map((f, i) => ({ title: f.q, content: <p>{f.a}</p>, open: i === 0 }))} />
        </section>

        {/* Mira */}
        <section className="mt-16 rounded-[var(--radius-panel)] bg-moss p-6 text-soft sm:p-10">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h2 className="h3">{t.ctaTitle}</h2>
              <p className="mt-2 text-soft/80">{t.ctaText}</p>
            </div>
            <AskMiraButton label={dict.collection.miraCta} className="btn btn-on-dark" />
          </div>
        </section>
      </div>
    </>
  );
}
