import { ProductGrid } from "@/components/product/ProductCard";
import { DealCard } from "@/components/promo/DealCard";
import { BLACKFRIDAY, blackFridayCopy, type BlackFridayGroup, type BlackFridayPhase } from "@/content/blackfriday";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductCard } from "@/lib/shopify/types";

/** The campaign kits of one group, in the order of its handles; sold-out ones are left out. */
export function blackFridayProducts(group: BlackFridayGroup, all: ProductCard[]): ProductCard[] {
  const byHandle = new Map(all.map((product) => [product.handle, product]));
  return group.handles.flatMap((handle) => {
    const product = byHandle.get(handle);
    return product?.availableForSale ? [product] : [];
  });
}

/** Deal cards (struck-through price, code price, saving) while the campaign runs; plain product cards afterwards. */
export function BlackFridayDealGrid({ products, phase, locale, dict }: { products: ProductCard[]; phase: BlackFridayPhase; locale: Locale; dict: Dictionary }) {
  const t = blackFridayCopy(locale);
  if (products.length === 0) return <p className="text-ink-muted">{t.unavailable}</p>;
  if (phase === "ended") return <ProductGrid products={products} locale={locale} dict={dict} />;
  return (
    // phones: one swipeable row per topic (the next card peeks in); from sm up: a grid
    <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
      {products.map((product) => (
        <li key={product.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
          <DealCard product={product} percent={BLACKFRIDAY.percent} badge={t.dealBadge} withCode={t.withCode} instead={t.instead} save={t.save} locale={locale} dict={dict} />
        </li>
      ))}
    </ul>
  );
}
