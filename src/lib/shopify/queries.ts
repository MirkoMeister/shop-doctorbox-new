import "server-only";
import type { Locale } from "@/lib/i18n/config";
import { nodes, shopifyFetch, soft } from "./client";
import { applyReviewSummaries } from "@/lib/reviews/etrusted";
import { CART_FRAGMENT, IMAGE_FRAGMENT, PRODUCT_CARD_FRAGMENT, PRODUCT_FRAGMENT } from "./fragments";
import {
  collectionTitle,
  decodeEntities,
  EXCLUDED_COLLECTIONS,
  isVisibleProduct,
  parseBiomarkers,
  reshapeProduct,
  reshapeProductCard,
  SUPPLEMENT_TYPE,
  type RawProduct,
  type RawProductCard,
} from "./reshape";
import type {
  Article,
  Blog,
  Cart,
  CartLine,
  Collection,
  Image,
  Page,
  Policy,
  Product,
  ProductCard,
  SearchResult,
} from "./types";

const CTX = "@inContext(language: $language, country: $country)";
const CTX_VARS = "$language: LanguageCode, $country: CountryCode";

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!, ${CTX_VARS}) ${CTX} {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export async function getProduct(handle: string, locale: Locale): Promise<Product | null> {
  const data = await shopifyFetch<{ product: RawProduct | null }>(PRODUCT_QUERY, {
    variables: { handle },
    locale,
    tags: ["products", `product:${handle}`],
  });
  if (!data.product || !isVisibleProduct(data.product)) return null;
  return reshapeProduct(data.product);
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean, ${CTX_VARS}) ${CTX} {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ProductCardFields
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export type ProductSort = "relevance" | "price-asc" | "price-desc" | "new";

function sortArgs(sort: ProductSort | undefined) {
  switch (sort) {
    case "price-asc":
      return { sortKey: "PRICE", reverse: false };
    case "price-desc":
      return { sortKey: "PRICE", reverse: true };
    case "new":
      return { sortKey: "CREATED_AT", reverse: true };
    default:
      return { sortKey: "BEST_SELLING", reverse: false };
  }
}

export async function getAllProducts(
  locale: Locale,
  opts: { sort?: ProductSort; query?: string } = {},
): Promise<ProductCard[]> {
  const out: ProductCard[] = [];
  let after: string | null = null;
  const baseQuery = ["-tag:IT", opts.query].filter(Boolean).join(" ");
  do {
    const data: {
      products: { pageInfo: { hasNextPage: boolean; endCursor: string }; edges: { node: RawProductCard }[] };
    } = await shopifyFetch(PRODUCTS_QUERY, {
      variables: { first: 250, after, query: baseQuery, ...sortArgs(opts.sort) },
      locale,
      tags: ["products"],
    });
    out.push(...nodes(data.products).filter(isVisibleProduct).map(reshapeProductCard));
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);
  return applyReviewSummaries(out);
}

const PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  query Recommendations($productId: ID!, ${CTX_VARS}) ${CTX} {
    productRecommendations(productId: $productId) {
      ...ProductCardFields
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export async function getProductRecommendations(productId: string, locale: Locale): Promise<ProductCard[]> {
  try {
    const data = await shopifyFetch<{ productRecommendations: RawProductCard[] | null }>(
      PRODUCT_RECOMMENDATIONS_QUERY,
      { variables: { productId }, locale, tags: ["products"] },
    );
    return applyReviewSummaries((data.productRecommendations ?? []).filter(isVisibleProduct).map(reshapeProductCard).slice(0, 4));
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

const COLLECTION_FIELDS = /* GraphQL */ `
  fragment CollectionFields on Collection {
    handle
    title
    description
    descriptionHtml
    updatedAt
    image {
      ...ImageFields
    }
    seo {
      title
      description
    }
  }
  ${IMAGE_FRAGMENT}
`;

const COLLECTION_QUERY = /* GraphQL */ `
  query Collection($handle: String!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, ${CTX_VARS}) ${CTX} {
    collection(handle: $handle) {
      ...CollectionFields
      products(first: 100, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductCardFields
          }
        }
      }
    }
  }
  ${COLLECTION_FIELDS}
  ${PRODUCT_CARD_FRAGMENT}
`;

function collectionSortArgs(sort: ProductSort | undefined) {
  switch (sort) {
    case "price-asc":
      return { sortKey: "PRICE", reverse: false };
    case "price-desc":
      return { sortKey: "PRICE", reverse: true };
    case "new":
      return { sortKey: "CREATED", reverse: true };
    default:
      return { sortKey: "BEST_SELLING", reverse: false };
  }
}

export async function getCollection(
  handle: string,
  locale: Locale,
  sort?: ProductSort,
): Promise<(Collection & { products: ProductCard[] }) | null> {
  if (EXCLUDED_COLLECTIONS.includes(handle)) return null;
  const data = await shopifyFetch<{
    collection: (Collection & { products: { edges: { node: RawProductCard }[] } }) | null;
  }>(COLLECTION_QUERY, {
    variables: { handle, ...collectionSortArgs(sort) },
    locale,
    tags: ["collections", `collection:${handle}`],
  });
  if (!data.collection) return null;
  const { products, ...rest } = data.collection;
  let cards = nodes(products).filter(isVisibleProduct).map(reshapeProductCard);
  // Supplements arrive via Shopify Collective and are not always assigned to the collection:
  // every product of that type belongs here.
  if (handle === SUPPLEMENTS_COLLECTION) {
    const all = await getAllProducts(locale, { sort, query: `product_type:"${SUPPLEMENT_TYPE}"` });
    const seen = new Set(cards.map((p) => p.id));
    cards = [...cards, ...all.filter((p) => !seen.has(p.id))];
  }
  return { ...rest, title: collectionTitle(rest.handle, rest.title), products: await applyReviewSummaries(cards) };
}

export const SUPPLEMENTS_COLLECTION = "nahrungserganzungsmittel";

const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections(${CTX_VARS}) ${CTX} {
    collections(first: 100) {
      edges {
        node {
          ...CollectionFields
          products(first: 1) {
            edges {
              node {
                handle
              }
            }
          }
        }
      }
    }
  }
  ${COLLECTION_FIELDS}
`;

export async function getCollections(locale: Locale): Promise<Collection[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: Collection & { products: { edges: unknown[] } } }[] };
  }>(COLLECTIONS_QUERY, { locale, tags: ["collections"] });
  return nodes(data.collections)
    .filter((c) => !EXCLUDED_COLLECTIONS.includes(c.handle))
    .map((c) => {
      const { products: _products, ...rest } = c;
      void _products;
      return { ...rest, title: collectionTitle(rest.handle, rest.title) };
    });
}

/**
 * Curated navigation set. Collections not listed here still resolve by URL
 * (SEO), they just do not appear in the main navigation.
 */
export const NAV_COLLECTIONS = [
  "sexuelle-gesundheit",
  "nahrstoffe-vitamine",
  "hormone",
  "herz-kreislauf",
  "frauengesundheit",
  "mannergesundheit",
  "longevity",
  "vorsorge",
  "kinderwunsch-fruchtbarkeit",
  "dna",
  "allergie-unvertraglichkeiten",
  "energie-vitalitat",
  "nahrungserganzungsmittel",
] as const;

export const TOP_PICKS_COLLECTION = "unsere-top-picks";

export async function getNavCollections(locale: Locale): Promise<Collection[]> {
  const all = await getCollections(locale);
  const byHandle = new Map(all.map((c) => [c.handle, c]));
  return NAV_COLLECTIONS.map((h) => byHandle.get(h)).filter((c): c is Collection => Boolean(c));
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

const PREDICTIVE_SEARCH_QUERY = /* GraphQL */ `
  query Predictive($query: String!, $limit: Int!, ${CTX_VARS}) ${CTX} {
    predictiveSearch(query: $query, limit: $limit, limitScope: EACH, types: [PRODUCT, QUERY, COLLECTION]) {
      products {
        ...ProductCardFields
      }
      queries {
        text
        styledText
      }
      collections {
        handle
        title
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export async function predictiveSearch(query: string, locale: Locale, limit = 6): Promise<SearchResult> {
  const data = await shopifyFetch<{
    predictiveSearch: {
      products: RawProductCard[];
      queries: { text: string; styledText: string }[];
      collections: { handle: string; title: string }[];
    } | null;
  }>(PREDICTIVE_SEARCH_QUERY, { variables: { query, limit }, locale, revalidate: 60 });
  const r = data.predictiveSearch;
  return {
    products: (r?.products ?? []).filter(isVisibleProduct).map(reshapeProductCard),
    queries: r?.queries ?? [],
    collections: (r?.collections ?? []).filter((c) => !EXCLUDED_COLLECTIONS.includes(c.handle)),
  };
}

const SEARCH_QUERY = /* GraphQL */ `
  query Search($query: String!, ${CTX_VARS}) ${CTX} {
    search(query: $query, first: 50, types: [PRODUCT], productFilters: [{ tag: "IT" }]) {
      edges {
        node {
          ... on Product {
            ...ProductCardFields
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export async function searchProducts(query: string, locale: Locale): Promise<ProductCard[]> {
  // Note: productFilters cannot negate; we filter Italian products client side.
  const data = await shopifyFetch<{ search: { edges: { node: RawProductCard }[] } }>(
    SEARCH_QUERY.replace(', productFilters: [{ tag: "IT" }]', ""),
    { variables: { query }, locale, revalidate: 60 },
  );
  return applyReviewSummaries(
    nodes(data.search)
    .filter((n) => n && "handle" in n)
    .filter(isVisibleProduct)
    .map(reshapeProductCard),
  );
}

/* ------------------------------------------------------------------ */
/* Pages, Blogs, Policies                                              */
/* ------------------------------------------------------------------ */

const PAGE_QUERY = /* GraphQL */ `
  query Page($handle: String!, ${CTX_VARS}) ${CTX} {
    page(handle: $handle) {
      handle
      title
      body
      bodySummary
      updatedAt
      seo {
        title
        description
      }
    }
  }
`;

async function _getPage(handle: string, locale: Locale): Promise<Page | null> {
  const data = await shopifyFetch<{ page: Page | null }>(PAGE_QUERY, {
    variables: { handle },
    locale,
    tags: ["pages", `page:${handle}`],
  });
  return data.page;
}
export function getPage(handle: string, locale: Locale): Promise<Page | null> {
  return soft(_getPage(handle, locale), null, "getPage");
}


const PAGES_QUERY = /* GraphQL */ `
  query Pages($after: String, ${CTX_VARS}) ${CTX} {
    pages(first: 250, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          handle
          title
          updatedAt
        }
      }
    }
  }
`;

async function _getAllPageHandles(locale: Locale): Promise<Pick<Page, "handle" | "title" | "updatedAt">[]> {
  const out: Pick<Page, "handle" | "title" | "updatedAt">[] = [];
  let after: string | null = null;
  do {
    const data: {
      pages: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        edges: { node: Pick<Page, "handle" | "title" | "updatedAt"> }[];
      };
    } = await shopifyFetch(PAGES_QUERY, { variables: { after }, locale, tags: ["pages"] });
    out.push(...nodes(data.pages));
    after = data.pages.pageInfo.hasNextPage ? data.pages.pageInfo.endCursor : null;
  } while (after);
  return out;
}
export function getAllPageHandles(locale: Locale): Promise<Pick<Page, "handle" | "title" | "updatedAt">[]> {
  return soft(_getAllPageHandles(locale), [], "getAllPageHandles");
}


const ARTICLE_FIELDS = /* GraphQL */ `
  fragment ArticleFields on Article {
    handle
    title
    excerpt
    summary: content(truncateAt: 700)
    publishedAt
    tags
    authorV2 {
      name
    }
    image {
      ...ImageFields
    }
    seo {
      title
      description
    }
    blog {
      handle
      title
    }
  }
  ${IMAGE_FRAGMENT}
`;

type RawArticle = Omit<Article, "author" | "contentHtml" | "summary"> & { authorV2: { name: string } | null; contentHtml?: string; summary?: string | null };
const reshapeArticle = (a: RawArticle): Article => ({
  handle: a.handle,
  title: decodeEntities(a.title),
  excerpt: a.excerpt,
  summary: a.summary ?? null,
  contentHtml: a.contentHtml ?? "",
  publishedAt: a.publishedAt,
  image: a.image,
  author: a.authorV2?.name ?? null,
  tags: a.tags,
  seo: a.seo,
  blog: { ...a.blog, title: decodeEntities(a.blog.title) },
});

const BLOGS_QUERY = /* GraphQL */ `
  query Blogs(${CTX_VARS}) ${CTX} {
    blogs(first: 20) {
      edges {
        node {
          handle
          title
          seo {
            title
            description
          }
        }
      }
    }
  }
`;

export const EXCLUDED_BLOGS = ["blog-salute-sessuale"];

async function _getBlogs(locale: Locale): Promise<Blog[]> {
  const data = await shopifyFetch<{ blogs: { edges: { node: Blog }[] } }>(BLOGS_QUERY, {
    locale,
    tags: ["blogs"],
  });
  return nodes(data.blogs)
    .filter((b) => !EXCLUDED_BLOGS.includes(b.handle))
    .map((b) => ({ ...b, title: decodeEntities(b.title) }));
}
export function getBlogs(locale: Locale): Promise<Blog[]> {
  return soft(_getBlogs(locale), [], "getBlogs");
}


const BLOG_QUERY = /* GraphQL */ `
  query Blog($handle: String!, ${CTX_VARS}) ${CTX} {
    blog(handle: $handle) {
      handle
      title
      seo {
        title
        description
      }
      articles(first: 100, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            ...ArticleFields
          }
        }
      }
    }
  }
  ${ARTICLE_FIELDS}
`;

async function _getBlog(handle: string, locale: Locale): Promise<(Blog & { articles: Article[] }) | null> {
  if (EXCLUDED_BLOGS.includes(handle)) return null;
  const data = await shopifyFetch<{
    blog: (Blog & { articles: { edges: { node: RawArticle }[] } }) | null;
  }>(BLOG_QUERY, { variables: { handle }, locale, tags: ["blogs", `blog:${handle}`] });
  if (!data.blog) return null;
  const { articles, ...rest } = data.blog;
  return { ...rest, title: decodeEntities(rest.title), articles: nodes(articles).map(reshapeArticle) };
}

export function getBlog(handle: string, locale: Locale): Promise<(Blog & { articles: Article[] }) | null> {
  return soft(_getBlog(handle, locale), null, "getBlog");
}

const ARTICLE_QUERY = /* GraphQL */ `
  query Article($blog: String!, $handle: String!, ${CTX_VARS}) ${CTX} {
    blog(handle: $blog) {
      articleByHandle(handle: $handle) {
        ...ArticleFields
        contentHtml
      }
    }
  }
  ${ARTICLE_FIELDS}
`;

async function _getArticle(blog: string, handle: string, locale: Locale): Promise<Article | null> {
  if (EXCLUDED_BLOGS.includes(blog)) return null;
  const data = await shopifyFetch<{ blog: { articleByHandle: RawArticle | null } | null }>(ARTICLE_QUERY, {
    variables: { blog, handle },
    locale,
    tags: ["blogs", `article:${handle}`],
  });
  const a = data.blog?.articleByHandle;
  return a ? reshapeArticle(a) : null;
}
export function getArticle(blog: string, handle: string, locale: Locale): Promise<Article | null> {
  return soft(_getArticle(blog, handle, locale), null, "getArticle");
}


const ARTICLES_QUERY = /* GraphQL */ `
  query Articles($first: Int!, $after: String, ${CTX_VARS}) ${CTX} {
    articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ArticleFields
        }
      }
    }
  }
  ${ARTICLE_FIELDS}
`;

async function _getLatestArticles(locale: Locale, limit = 3): Promise<Article[]> {
  const data = await shopifyFetch<{ articles: { edges: { node: RawArticle }[] } }>(ARTICLES_QUERY, {
    variables: { first: Math.min(limit * 2, 50) },
    locale,
    tags: ["blogs"],
  });
  return nodes(data.articles)
    .filter((a) => !EXCLUDED_BLOGS.includes(a.blog.handle))
    .slice(0, limit)
    .map(reshapeArticle);
}
export function getLatestArticles(locale: Locale, limit = 3): Promise<Article[]> {
  return soft(_getLatestArticles(locale, limit), [], "getLatestArticles");
}


async function _getAllArticles(locale: Locale): Promise<Article[]> {
  const out: Article[] = [];
  let after: string | null = null;
  do {
    const data: {
      articles: { pageInfo: { hasNextPage: boolean; endCursor: string }; edges: { node: RawArticle }[] };
    } = await shopifyFetch(ARTICLES_QUERY, { variables: { first: 250, after }, locale, tags: ["blogs"] });
    out.push(...nodes(data.articles).map(reshapeArticle));
    after = data.articles.pageInfo.hasNextPage ? data.articles.pageInfo.endCursor : null;
  } while (after);
  return out.filter((a) => !EXCLUDED_BLOGS.includes(a.blog.handle));
}
export function getAllArticles(locale: Locale): Promise<Article[]> {
  return soft(_getAllArticles(locale), [], "getAllArticles");
}


const POLICIES_QUERY = /* GraphQL */ `
  query Policies(${CTX_VARS}) ${CTX} {
    shop {
      shippingPolicy { handle title body url }
      refundPolicy { handle title body url }
      privacyPolicy { handle title body url }
      termsOfService { handle title body url }
      subscriptionPolicy { handle title body url }
    }
  }
`;

export const POLICY_HANDLES = [
  "shipping-policy",
  "refund-policy",
  "privacy-policy",
  "terms-of-service",
  "subscription-policy",
  "legal-notice",
] as const;

async function _getPolicies(locale: Locale): Promise<Policy[]> {
  const data = await shopifyFetch<{ shop: Record<string, Policy | null> }>(POLICIES_QUERY, {
    locale,
    tags: ["policies"],
  });
  return Object.values(data.shop).filter((p): p is Policy => Boolean(p));
}
export function getPolicies(locale: Locale): Promise<Policy[]> {
  return soft(_getPolicies(locale), [], "getPolicies");
}


export async function getPolicy(handle: string, locale: Locale): Promise<Policy | null> {
  const all = await getPolicies(locale);
  return all.find((p) => p.handle === handle) ?? null;
}

/* ------------------------------------------------------------------ */
/* Shop                                                                */
/* ------------------------------------------------------------------ */

const SHOP_QUERY = /* GraphQL */ `
  query Shop(${CTX_VARS}) ${CTX} {
    shop {
      name
      description
      brand {
        logo {
          image {
            ...ImageFields
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

export async function getShop(locale: Locale): Promise<{ name: string; description: string | null; logo: Image | null }> {
  const data = await shopifyFetch<{
    shop: { name: string; description: string | null; brand: { logo: { image: Image } | null } | null };
  }>(SHOP_QUERY, { locale, tags: ["shop"] });
  return { name: data.shop.name, description: data.shop.description, logo: data.shop.brand?.logo?.image ?? null };
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

type RawCartLine = Omit<CartLine, "merchandise"> & {
  merchandise: Omit<CartLine["merchandise"], "product"> & {
    product: Omit<CartLine["merchandise"]["product"], "biomarkers" | "sampleMaterial"> & {
      biomarkers: { value: string } | null;
      sampleMaterial: { value: string } | null;
    };
  };
};
type RawCart = Omit<Cart, "lines"> & { lines: { edges: { node: RawCartLine }[] } };
const reshapeCart = (c: RawCart | null): Cart | null =>
  c
    ? {
        ...c,
        lines: nodes(c.lines).map((l) => ({
          ...l,
          merchandise: {
            ...l.merchandise,
            product: {
              ...l.merchandise.product,
              biomarkers: parseBiomarkers(l.merchandise.product.biomarkers?.value),
              sampleMaterial: l.merchandise.product.sampleMaterial?.value ?? null,
            },
          },
        })),
      }
    : null;

const CART_QUERY = /* GraphQL */ `
  query Cart($id: ID!, ${CTX_VARS}) ${CTX} {
    cart(id: $id) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export async function fetchCart(id: string, locale: Locale): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: RawCart | null }>(CART_QUERY, {
    variables: { id },
    locale,
    cache: "no-store",
  });
  return reshapeCart(data.cart);
}

export type CartLineInput = { merchandiseId: string; quantity: number; sellingPlanId?: string };

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!], ${CTX_VARS}) ${CTX} {
    cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: $country } }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_ADD = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, ${CTX_VARS}) ${CTX} {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_UPDATE = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, ${CTX_VARS}) ${CTX} {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_REMOVE = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, ${CTX_VARS}) ${CTX} {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

type CartMutation = { cart: RawCart | null; userErrors: { field: string[] | null; message: string }[] };

function unwrap(result: CartMutation): Cart {
  if (result.userErrors?.length) throw new Error(result.userErrors.map((e) => e.message).join(", "));
  const cart = reshapeCart(result.cart);
  if (!cart) throw new Error("Cart mutation returned no cart");
  return cart;
}

export async function createCart(lines: CartLineInput[], locale: Locale): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartMutation }>(CART_CREATE, {
    variables: { lines },
    locale,
    cache: "no-store",
  });
  return unwrap(data.cartCreate);
}

export async function addCartLines(cartId: string, lines: CartLineInput[], locale: Locale): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutation }>(CART_LINES_ADD, {
    variables: { cartId, lines },
    locale,
    cache: "no-store",
  });
  return unwrap(data.cartLinesAdd);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
  locale: Locale,
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutation }>(CART_LINES_UPDATE, {
    variables: { cartId, lines },
    locale,
    cache: "no-store",
  });
  return unwrap(data.cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[], locale: Locale): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutation }>(CART_LINES_REMOVE, {
    variables: { cartId, lineIds },
    locale,
    cache: "no-store",
  });
  return unwrap(data.cartLinesRemove);
}
