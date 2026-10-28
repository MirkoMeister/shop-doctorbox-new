import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/queries";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, "/cart", { title: dict.cart.title, noIndex: true });
}

export default async function CartPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  // suggestions: the most reviewed tests, the view drops what is already in the cart
  const suggestions = await getAllProducts(locale)
    .then((all) =>
      all
        .filter((p) => p.handle !== "darmkrebsvorsorge" && p.ratingCount > 0)
        .sort((a, b) => b.ratingCount - a.ratingCount)
        .slice(0, 8),
    )
    .catch(() => []);
  return <CartPageView locale={locale} dict={dict} suggestions={suggestions} />;
}
