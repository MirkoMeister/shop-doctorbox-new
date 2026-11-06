import "server-only";
import { unstable_cache } from "next/cache";
import { shopifyLanguage, type Locale } from "@/lib/i18n/config";
import type { ShippingCountry } from "@/lib/shipping";
import { shopifyFetch } from "./client";

const COUNTRIES = /* GraphQL */ `
  query ShippingCountries($language: LanguageCode) @inContext(language: $language) {
    localization {
      availableCountries {
        isoCode
        name
      }
    }
    products(first: 10, sortKey: BEST_SELLING, query: "available_for_sale:true") {
      nodes {
        vendor
        variants(first: 1) {
          nodes {
            id
            availableForSale
          }
        }
      }
    }
  }
`;

type CountriesResult = {
  localization: { availableCountries: { isoCode: string; name: string }[] };
  products: { nodes: { vendor: string; variants: { nodes: { id: string; availableForSale: boolean }[] } }[] };
};

const RATE_PROBE = /* GraphQL */ `
  mutation ShippingRateProbe($lines: [CartLineInput!], $country: CountryCode!, $addressCountry: String!) {
    cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: $country, deliveryAddressPreferences: [{ deliveryAddress: { country: $addressCountry } }] } }) {
      cart {
        deliveryGroups(first: 1) {
          nodes {
            deliveryOptions {
              estimatedCost {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

type RateProbe = {
  cartCreate: {
    cart: { deliveryGroups: { nodes: { deliveryOptions: { estimatedCost: { amount: string; currencyCode: string } }[] }[] } } | null;
  };
};

/**
 * Countries the shop delivers to (Shopify Markets) with the standard shipping rate for one kit, measured
 * on throwaway carts that carry only the country (no order, no customer data). Same idea as the
 * multi-buy probe: Shopify stays the only place where rates are set. Cached for an hour.
 * Countries without a rate (no shipping zone) are left out, so the shop never offers what checkout refuses.
 */
export const getShippingCountries = unstable_cache(
  async (locale: Locale): Promise<ShippingCountry[]> => {
    const data = await shopifyFetch<CountriesResult>(COUNTRIES, {
      variables: { language: shopifyLanguage(locale) },
      revalidate: 3600,
    });
    // a kit from our own stock (Youngle ships its products itself, with its own rates)
    const variant = data.products.nodes.find((p) => !/youngle/i.test(p.vendor) && p.variants.nodes[0]?.availableForSale)?.variants.nodes[0];
    if (!variant) throw new Error("No product to measure shipping rates with");
    const rates = await Promise.all(
      data.localization.availableCountries.map(async (c): Promise<ShippingCountry | null> => {
        try {
          const probe = await shopifyFetch<RateProbe>(RATE_PROBE, {
            variables: { lines: [{ merchandiseId: variant.id, quantity: 1 }], country: c.isoCode, addressCountry: c.isoCode },
            cache: "no-store",
          });
          const options = probe.cartCreate.cart?.deliveryGroups.nodes[0]?.deliveryOptions ?? [];
          if (!options.length) return null;
          const cheapest = options.map((o) => o.estimatedCost).sort((a, b) => Number(a.amount) - Number(b.amount))[0];
          return { code: c.isoCode, name: c.name, shipping: { amount: cheapest.amount, currencyCode: cheapest.currencyCode } };
        } catch {
          return null;
        }
      }),
    );
    const list = rates.filter((r): r is ShippingCountry => r !== null);
    // an empty answer means Shopify could not be asked: throw, so it is not cached for an hour
    if (!list.length) throw new Error("No shipping rates from Shopify");
    const collator = new Intl.Collator(locale);
    // Germany first, the rest alphabetically
    return list.sort((a, b) => (a.code === "DE" ? -1 : b.code === "DE" ? 1 : collator.compare(a.name, b.name)));
  },
  ["shipping-countries-v2"],
  { revalidate: 3600, tags: ["shipping-countries-v2"] },
);
