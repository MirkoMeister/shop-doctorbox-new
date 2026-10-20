import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HowItWorks } from "@/components/home/Sections";
import { BiomarkerInfo } from "@/components/product/BiomarkerInfo";
import { matchBiomarker, resolveTopic } from "@/content/biomarkers";
import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { ProductGrid } from "@/components/product/ProductCard";
import { TrustMarquee } from "@/components/product/TrustMarquee";
import { RichText } from "@/components/content/RichText";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BiomarkerChips } from "@/components/ui/Chips";
import { CheckIcon, DropIcon } from "@/components/ui/Icons";
import { Rating } from "@/components/ui/Rating";
import { Highlight } from "@/components/ui/Highlight";
import { absoluteUrl, localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { sampleMaterials } from "@/lib/shopify/reshape";
import { getAllProducts, getProduct, getProductRecommendations } from "@/lib/shopify/queries";
import { stripHtml, truncate } from "@/lib/format";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; handle: string }> };

export async function generateStaticParams() {
  try {
    const products = await getAllProducts("de");
    return products.map((p) => ({ handle: p.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const product = await getProduct(decodeURIComponent(p.handle), locale);
  if (!product) return {};
  return {
    ...pageMetadata(locale, `/products/${product.handle}`, {
      title: product.seo.title || product.title,
      description: product.seo.description || truncate(stripHtml(product.descriptionHtml), 160),
      image: product.featuredImage?.url,
    }),
    title: { absolute: product.seo.title || `${product.title} | DoctorBox` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const handle = decodeURIComponent(p.handle);
  const product = await getProduct(handle, locale);
  if (!product) notFound();
  const related = await getProductRecommendations(product.id, locale);

  const primaryCollection = product.collections.find((c) => !["produkte", "home-page", "kapillarblut", "unsere-top-picks", "vorsorge-kampagne"].includes(c.handle));
  const crumbs = [
    { label: dict.common.home, href: localeHref(locale, "/") },
    { label: dict.collection.all, href: localeHref(locale, "/collections") },
    ...(primaryCollection
      ? [{ label: primaryCollection.title, href: localeHref(locale, `/collections/${primaryCollection.handle}`) }]
      : []),
    { label: product.title },
  ];
  const samples = sampleMaterials(product.sampleMaterial);

  // Editorial info per analysed value (deduplicated: several metafield entries can map to one topic entry)
  const seen = new Set<string>();
  const matched = product.biomarkers
    .map((name) => matchBiomarker(name, locale))
    .filter((m): m is NonNullable<typeof m> => Boolean(m) && !seen.has(m!.key) && Boolean(seen.add(m!.key)));
  const infoItems = matched.map((m) => ({ name: m.title, entry: m.entry }));
  const topic = resolveTopic(matched, locale);

  const accordion = [
    {
      title: dict.product.description,
      content: <RichText html={product.descriptionHtml} locale={locale} className="!text-[0.98rem]" />,
    },
    ...(product.hasSubscription
      ? [{ title: dict.product.subscriptionBenefits, content: <p>{dict.product.subscriptionBenefitsText}</p> }]
      : []),
    { title: dict.product.inTheBox, content: <p>{dict.product.inTheBoxText}</p> },
  ];

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product, locale),
          breadcrumbJsonLd(
            crumbs.map((c) => ({ name: c.label, url: c.href ? absoluteUrl(locale, c.href.replace(/^\/en/, "")) : absoluteUrl(locale, `/products/${product.handle}`) })),
          ),
          faqJsonLd(dict.product.faq),
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8 lg:pt-8">
        <Breadcrumbs items={crumbs} className="mb-5" />

        <ProductBuyBox product={product} locale={locale} dict={dict}>
          <h1 className="h1 text-balance">{product.title}</h1>
          <div className="mt-3">
            <Rating value={product.rating} count={product.ratingCount} dict={dict} />
          </div>

          {product.biomarkers.length > 0 && (
            <section className="mt-6" aria-labelledby="values">
              <h2 id="values" className="text-sm font-semibold text-green">
                {dict.product.analysedValues}
                <span className="ml-1.5 font-normal text-ink-muted">({product.biomarkers.length})</span>
              </h2>
              <BiomarkerChips values={product.biomarkers} className="mt-2.5" />
            </section>
          )}

          <dl className="mt-5 flex flex-col gap-3 text-[0.95rem]">
            {samples.length > 0 && (
              <div className="flex items-baseline gap-2.5">
                <DropIcon width={18} height={18} className="shrink-0 translate-y-[3px] text-green" />
                <dt className="shrink-0 text-ink-muted">{dict.product.sampleMaterial}:</dt>
                <dd className="font-medium">{samples.join(" / ")}</dd>
              </div>
            )}
            {product.targetGroup && (
              <div className="flex items-start gap-2.5">
                <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-green" />
                <div className="min-w-0">
                  <dt className="text-ink-muted">{dict.product.targetGroup}</dt>
                  <dd className="mt-0.5 font-medium leading-relaxed">{product.targetGroup}</dd>
                </div>
              </div>
            )}
          </dl>
        </ProductBuyBox>

      </div>

      <TrustMarquee dict={dict} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-12 max-w-4xl [&_.prose-db]:max-w-none">
          <Accordion items={accordion} />
          <p className="mt-4 text-xs text-ink-muted">{dict.product.medicalNote}</p>
        </div>
      </div>

      {infoItems.length > 0 && <BiomarkerInfo items={infoItems} topic={topic} />}

      <section className="mt-20 bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="h2 mb-8">
            <Highlight text={dict.home.howTitle} />
          </h2>
        </div>
        <HowItWorks dict={dict} compact />
      </section>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="h2 mb-8">
            <Highlight text={dict.product.related} />
          </h2>
          <ProductGrid products={related} locale={locale} dict={dict} />
        </section>
      )}

      <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="h2 mb-6">
          <Highlight text={dict.product.faqTitle} />
        </h2>
        <Accordion items={dict.product.faq.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} />
      </section>
    </>
  );
}
