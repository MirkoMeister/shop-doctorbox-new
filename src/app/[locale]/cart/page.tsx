import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, "/cart", { title: dict.cart.title, noIndex: true });
}

export default async function CartPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  return <CartPageView locale={locale} dict={dict} />;
}
