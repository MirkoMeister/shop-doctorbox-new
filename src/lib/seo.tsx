import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { absoluteUrl, alternates, siteUrl } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Article, Product } from "@/lib/shopify/types";
import { stripHtml, truncate } from "./format";

export function pageMetadata(
  locale: Locale,
  path: string,
  opts: { title?: string | null; description?: string | null; image?: string | null; noIndex?: boolean; type?: "website" | "article" },
): Metadata {
  const dict = getDictionary(locale);
  const title = opts.title?.trim() || dict.meta.defaultTitle;
  const description = truncate(opts.description?.trim() || dict.meta.defaultDescription, 160);
  const alt = alternates(path);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(locale, path), languages: alt.languages },
    robots: opts.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: absoluteUrl(locale, path),
      siteName: dict.meta.siteName,
      locale: locale === "en" ? "en_GB" : "de_DE",
      type: opts.type ?? "website",
      images: opts.image ? [{ url: opts.image }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: opts.image ? [opts.image] : undefined },
  };
}

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Brand"],
    "@id": `${siteUrl}/#organization`,
    name: "DoctorBox",
    url: absoluteUrl(locale, "/"),
    logo: `${siteUrl}/brand/logo-green.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Taubenstr. 26",
      postalCode: "10117",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49 30 34045468",
      email: "heimtest@doctorbox.eu",
      contactType: "customer service",
      availableLanguage: ["de", "en"],
    },
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: absoluteUrl(locale, "/"),
    name: getDictionary(locale).meta.siteName,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl(locale, "/search")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product, locale: Locale) {
  const url = absoluteUrl(locale, `/products/${product.handle}`);
  const prices = product.variants.map((v) => parseFloat(v.price.amount));
  const offers =
    product.variants.length === 1
      ? {
          "@type": "Offer",
          url,
          price: product.variants[0].price.amount,
          priceCurrency: product.variants[0].price.currencyCode,
          availability: product.variants[0].availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          sku: product.variants[0].sku ?? undefined,
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${siteUrl}/#organization` },
        }
      : {
          "@type": "AggregateOffer",
          url,
          lowPrice: Math.min(...prices).toFixed(2),
          highPrice: Math.max(...prices).toFixed(2),
          priceCurrency: product.priceRange.minVariantPrice.currencyCode,
          offerCount: product.variants.length,
          availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        };
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: truncate(stripHtml(product.descriptionHtml), 300),
    image: product.images.map((i) => i.url),
    sku: product.variants[0]?.sku ?? undefined,
    brand: { "@type": "Brand", name: "DoctorBox" },
    url,
    offers,
    ...(product.rating && product.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating.toFixed(1),
            reviewCount: product.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    additionalProperty: [
      ...(product.sampleMaterial
        ? [{ "@type": "PropertyValue", name: locale === "en" ? "Sample material" : "Probenmaterial", value: product.sampleMaterial }]
        : []),
      ...(product.biomarkers.length
        ? [{ "@type": "PropertyValue", name: locale === "en" ? "Analysed values" : "Analysierte Werte", value: product.biomarkers.join(", ") }]
        : []),
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function articleJsonLd(article: Article, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt,
    image: article.image ? [article.image.url] : undefined,
    author: article.author ? { "@type": "Person", name: article.author } : { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: absoluteUrl(locale, `/ratgeber/${article.handle}`),
    description: truncate(stripHtml(article.excerpt || article.contentHtml), 200),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
