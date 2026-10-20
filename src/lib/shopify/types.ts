export type Money = { amount: string; currencyCode: string };

export type Image = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type SellingPlan = {
  id: string;
  name: string;
  recurringDeliveries: boolean;
  options: { name: string; value: string }[];
  priceAdjustments: {
    adjustmentValue:
      | { __typename: "SellingPlanPercentagePriceAdjustment"; adjustmentPercentage: number }
      | { __typename: "SellingPlanFixedAmountPriceAdjustment"; adjustmentAmount: Money }
      | { __typename: "SellingPlanFixedPriceAdjustment"; price: Money };
  }[];
};

export type SellingPlanGroup = {
  name: string;
  options: { name: string; values: string[] }[];
  sellingPlans: SellingPlan[];
};

export type SellingPlanAllocation = {
  sellingPlan: { id: string; name: string };
  priceAdjustments: { price: Money; compareAtPrice: Money }[];
};

export type StoreAvailability = {
  available: boolean;
  pickUpTime: string;
  location: {
    name: string;
    address: { address1: string | null; city: string | null; zip: string | null };
  };
};

export type Variant = {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  requiresShipping: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
  image: Image | null;
  sellingPlanAllocations: SellingPlanAllocation[];
  storeAvailability: StoreAvailability[];
};

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  createdAt: string;
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  biomarkers: string[];
  sampleMaterial: string | null;
  targetGroup: string | null;
  rating: number | null;
  ratingCount: number;
  hasSubscription: boolean;
  /** Discount of the subscription plan in percent, e.g. 20 */
  subscriptionPercent: number | null;
  /** Upper-arm blood collection with Tasso+ available as a variant */
  tasso: boolean;
};

export type Product = ProductCard & {
  description: string;
  descriptionHtml: string;
  seo: { title: string | null; description: string | null };
  options: { name: string; values: string[] }[];
  images: Image[];
  variants: Variant[];
  sellingPlanGroups: SellingPlanGroup[];
  collections: { handle: string; title: string }[];
  updatedAt: string;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  seo: { title: string | null; description: string | null };
  updatedAt: string;
};

export type Page = {
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  seo: { title: string | null; description: string | null };
  updatedAt: string;
};

export type Article = {
  handle: string;
  title: string;
  excerpt: string | null;
  /** plain-text start of the article (for card summaries when no excerpt is set) */
  summary: string | null;
  contentHtml: string;
  publishedAt: string;
  image: Image | null;
  author: string | null;
  tags: string[];
  seo: { title: string | null; description: string | null };
  blog: { handle: string; title: string };
};

export type Blog = {
  handle: string;
  title: string;
  seo: { title: string | null; description: string | null };
};

export type Policy = {
  handle: string;
  title: string;
  body: string;
  url: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money; compareAtAmountPerQuantity: Money | null };
  sellingPlanAllocation: { sellingPlan: { id: string; name: string } } | null;
  merchandise: {
    id: string;
    title: string;
    requiresShipping: boolean;
    selectedOptions: { name: string; value: string }[];
    image: Image | null;
    product: { handle: string; title: string; featuredImage: Image | null; biomarkers: string[]; sampleMaterial: string | null };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: CartLine[];
};

export type SearchResult = {
  products: ProductCard[];
  queries: { text: string; styledText: string }[];
  collections: { handle: string; title: string }[];
};
