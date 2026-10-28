import Image from "next/image";
import Link from "next/link";
import { AssistantCard } from "@/components/collection/AssistantCard";
import { ProductCard, ProductGrid } from "@/components/product/ProductCard";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight } from "@/components/ui/Icons";
import { FORMULA_HANDLES, MEASURE_FIRST_HANDLES, VITAMIN_D_HANDLES, supplementsCopy } from "@/content/supplements";
import { miraDemo } from "@/content/mira-demo";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";

/**
 * Supplements by goal: jump chips, the measure-first block with the two matching
 * tests, one section per goal (vitamin D as a single card with its four forms),
 * unassigned products at the end.
 */
export function SupplementsView({ products, tests, locale, dict }: { products: ProductCardType[]; tests: ProductCardType[]; locale: Locale; dict: Dictionary }) {
  const t = supplementsCopy(locale);
  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const vitaminD = VITAMIN_D_HANDLES.map((h) => byHandle.get(h)).filter((p): p is ProductCardType => Boolean(p));
  const groups = t.groups
    .map((g) => ({ ...g, items: g.handles.filter((h) => h !== "vitamin-d").map((h) => byHandle.get(h)).filter((p): p is ProductCardType => Boolean(p)), withVitaminD: g.handles.includes("vitamin-d") && vitaminD.length > 0 }))
    .filter((g) => g.items.length > 0 || g.withVitaminD);
  const assigned = new Set([...t.groups.flatMap((g) => g.handles), ...VITAMIN_D_HANDLES]);
  const rest = products.filter((p) => !assigned.has(p.handle));
  const measureTests = MEASURE_FIRST_HANDLES.map((h) => tests.find((p) => p.handle === h)).filter((p): p is ProductCardType => Boolean(p));

  return (
    <div>
      {/* Goal picker */}
      <section className="mt-2" aria-labelledby="supp-pick">
        <div className="max-w-2xl">
          <h2 id="supp-pick" className="h2 text-balance">
            <Highlight text={t.pickTitle} />
          </h2>
          <p className="mt-3 text-lg text-ink-muted">{t.pickText}</p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {groups.map((g) => (
            <li key={g.key}>
              <a href={`#supp-${g.key}`} className="chip chip-outline hover:bg-lind">
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Measure first */}
      <section className="mt-12 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-8" aria-labelledby="supp-measure">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
          <div>
            <h2 id="supp-measure" className="h3 text-balance">
              <Highlight text={t.measureTitle} />
            </h2>
            <p className="mt-2 text-moss/80">{t.measureText}</p>
            <Link href={localeHref(locale, "/collections/nahrstoffe-vitamine")} className="btn btn-tertiary -ml-3 mt-3">
              {t.measureCta} <ArrowRight width={16} height={16} />
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {measureTests.map((p) => (
              <li key={p.id}>
                <Link href={localeHref(locale, `/products/${p.handle}`)} className="group flex items-center gap-3 rounded-2xl bg-white/80 p-3 transition-colors hover:bg-white">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                    {p.featuredImage && <Image src={shopifyImage(p.featuredImage.url, 160)} alt="" fill sizes="56px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">{p.title}</span>
                    <span className="block text-xs text-moss/70">{p.biomarkers.length === 1 ? dict.product.oneValue : `${p.biomarkers.length} ${dict.product.analysedValues.toLowerCase()}`}</span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{formatMoney(p.priceRange.minVariantPrice, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Groups */}
      {groups.map((g, gi) => (
        <section key={g.key} id={`supp-${g.key}`} className="mt-16 scroll-mt-24" aria-labelledby={`supp-${g.key}-title`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-2xl">
              <h2 id={`supp-${g.key}-title`} className="h3">{g.title}</h2>
              <p className="mt-1 text-ink-muted">{g.text}</p>
            </div>
            <p className="text-xs text-ink-muted">
              {g.items.some((p) => FORMULA_HANDLES.includes(p.handle)) && <span className="mr-3">{t.formulaNote}</span>}
              {g.items.some((p) => !FORMULA_HANDLES.includes(p.handle)) && <span>{t.singleNote}</span>}
            </p>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {g.items.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} locale={locale} dict={dict} priority={gi === 0 && i < 4} />
              </li>
            ))}
            {g.withVitaminD && (
              <li className="sm:col-span-2">
                <VitaminDCard products={vitaminD} locale={locale} title={t.vitaminDTitle} text={t.vitaminDText} formsLabel={t.vitaminDForms} />
              </li>
            )}
            {gi === 0 && (
              <li>
                <AssistantCard title={dict.collection.miraTitleSupplements} cta={dict.collection.miraCta} online={dict.assistant.online} demo={miraDemo("nahrungserganzungsmittel", locale)} />
              </li>
            )}
          </ul>
        </section>
      ))}

      {rest.length > 0 && (
        <section className="mt-16" aria-label={t.more}>
          <h2 className="h3">{t.more}</h2>
          <div className="mt-6">
            <ProductGrid products={rest} locale={locale} dict={dict} />
          </div>
        </section>
      )}
    </div>
  );
}

/** The four biomo vitamin D products as one card: shared image and text, one chip per form */
function VitaminDCard({ products, locale, title, text, formsLabel }: { products: ProductCardType[]; locale: Locale; title: string; text: string; formsLabel: string }) {
  const first = products[0];
  const form = (p: ProductCardType) => p.title.replace(/^Vitamin D3 biomo®\s*(2\.000 I\.E\.)?\s*/i, "").replace(/^-\s*/, "").replace(/\(vegan\)\s*-\s*/i, "vegan, ").trim();
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white text-ink shadow-card sm:flex-row">
      <div className="relative aspect-[4/3] bg-white sm:aspect-auto sm:w-2/5">
        {first.featuredImage && <Image src={shopifyImage(first.featuredImage.url, 600)} alt="" fill sizes="(min-width: 640px) 240px, 100vw" className="object-contain p-4" />}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-green">biomo</p>
        <h3 className="mt-1 text-[1.0625rem] font-semibold leading-snug">{title}</h3>
        <p className="mt-1.5 text-sm leading-snug text-ink-muted">{text}</p>
        <p className="mt-4 text-xs font-medium text-ink-muted">{formsLabel}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {products.map((p) => (
            <li key={p.id}>
              <Link href={localeHref(locale, `/products/${p.handle}`)} className="chip chip-outline !py-1.5 text-sm hover:bg-lind">
                {form(p)} · {formatMoney(p.priceRange.minVariantPrice, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
