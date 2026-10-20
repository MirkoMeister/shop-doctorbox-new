import Image from "next/image";
import Link from "next/link";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight, CheckIcon } from "@/components/ui/Icons";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductCard } from "@/lib/shopify/types";

const VIDEO = "/videos/banner-tasso-web.mp4";
const POSTER = "/videos/banner-tasso-poster.jpg";

/**
 * Home banner for the Tasso+ upper-arm blood collection: the product video runs muted
 * on a loop next to three plain steps and the two all-round checks that ship with it.
 */
export function TassoBanner({ locale, dict, products }: { locale: Locale; dict: Dictionary; products: ProductCard[] }) {
  const t = dict.home.tasso;
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="tasso-title">
      <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-moss text-soft">
        <div className="grid lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
          {/* Video */}
          <div className="relative aspect-[4/3] sm:aspect-video lg:aspect-auto lg:min-h-[520px]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={VIDEO}
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={t.videoLabel}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-moss/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-moss" />
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-moss">
              {t.badge}
            </span>
          </div>

          {/* Copy */}
          <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
            <Image
              src="/brand/shape-circle.svg"
              alt=""
              width={369}
              height={369}
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 w-[320px] opacity-[0.12]"
            />
            <p className="relative text-sm font-medium text-turquoise">{t.kicker}</p>
            <h2 id="tasso-title" className="h2 relative mt-3 text-balance">
              <Highlight text={t.title} tone="dark" />
            </h2>
            <p className="relative mt-4 max-w-xl text-lg leading-relaxed text-soft/85">{t.text}</p>

            <ol className="relative mt-6 grid gap-2.5 sm:grid-cols-3">
              {t.steps.map((s, i) => (
                <li key={s} className="flex items-start gap-2.5 text-[0.95rem] leading-snug">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-turquoise/25 text-xs font-semibold text-turquoise">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>

            <p className="relative mt-8 text-xs font-medium uppercase tracking-[0.16em] text-soft/70">{t.productsTitle}</p>
            <ul className="relative mt-3 grid gap-3">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={localeHref(locale, `/products/${p.handle}`)}
                    className="group flex items-center gap-3 rounded-2xl bg-white/10 p-3 transition-colors hover:bg-white/15"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/10">
                      {p.featuredImage && <Image src={shopifyImage(p.featuredImage.url, 160)} alt="" fill sizes="56px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">{p.title}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-soft/75">
                        <CheckIcon width={12} height={12} className="text-turquoise" />
                        {fill(dict.product.valuesCount, { n: p.biomarkers.length })} · {dict.product.sampleMaterial}: {p.sampleMaterial?.split("|")[0]?.trim()}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end">
                      <span className="font-semibold tabular-nums">{formatMoney(p.priceRange.minVariantPrice, locale)}</span>
                      <ArrowRight width={16} height={16} className="mt-1 text-turquoise transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="relative mt-4 text-xs leading-snug text-soft/60">{t.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
