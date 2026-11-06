import "server-only";
import { unstable_cache } from "next/cache";
import { MULTI_BUY } from "@/content/bundles";
import { shopifyFetch } from "./client";

const PROBE = /* GraphQL */ `
  mutation MultiBuyProbe($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: DE } }) {
      cart {
        lines(first: 1) {
          edges {
            node {
              cost {
                subtotalAmount {
                  amount
                }
              }
              discountAllocations {
                discountedAmount {
                  amount
                }
                ... on CartAutomaticDiscountAllocation {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

type Probe = {
  cartCreate: {
    cart: {
      lines: { edges: { node: { cost: { subtotalAmount: { amount: string } }; discountAllocations: { discountedAmount: { amount: string }; title?: string }[] } }[] };
    } | null;
  };
};

/**
 * Percentage the automatic "zu zweit" discount takes off a kit, measured on a throwaway cart with two
 * kits (no order, no customer data). Cached for an hour per product; null when the discount is not
 * active, so the page shows no offer instead of a wrong one.
 */
export async function getMultiBuyPercent(handle: string, variantId: string): Promise<number | null> {
  const offer = MULTI_BUY[handle];
  if (!offer) return null;
  try {
    return await cachedProbe(handle, variantId, offer.discount);
  } catch (err) {
    console.warn("[multi-buy]", handle, err instanceof Error ? err.message : err);
    return null;
  }
}

const cachedProbe = unstable_cache(
  async (_handle: string, variantId: string, discount: string): Promise<number | null> => {
    const data = await shopifyFetch<Probe>(PROBE, { variables: { lines: [{ merchandiseId: variantId, quantity: 2 }] }, cache: "no-store" });
    const line = data.cartCreate.cart?.lines.edges[0]?.node;
    if (!line) return null;
    const subtotal = Number(line.cost.subtotalAmount.amount);
    const off = line.discountAllocations.filter((d) => d.title === discount).reduce((s, d) => s + Number(d.discountedAmount.amount), 0);
    if (!subtotal || !off) return null;
    return Math.round((off / subtotal) * 1000) / 10;
  },
  ["multi-buy-percent"],
  { revalidate: 3600, tags: ["multi-buy"] },
);
