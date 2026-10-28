export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

/** Everything a product card needs, incl. the DoctorBox metafields. */
export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCardFields on Product {
    id
    handle
    title
    availableForSale
    productType
    vendor
    excerpt: description(truncateAt: 160)
    tags
    createdAt
    featuredImage {
      ...ImageFields
    }
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFields
      }
    }
    biomarkers: metafield(namespace: "custom", key: "biomarkers") {
      value
    }
    sampleMaterial: metafield(namespace: "custom", key: "sample_material") {
      value
    }
    targetGroup: metafield(namespace: "custom", key: "target_group") {
      value
    }
    rating: metafield(namespace: "reviews", key: "rating") {
      value
    }
    ratingCount: metafield(namespace: "reviews", key: "rating_count") {
      value
    }
    options {
      name
      values
    }
    subscriptionPlans: sellingPlanGroups(first: 1) {
      edges {
        node {
          sellingPlans(first: 1) {
            edges {
              node {
                priceAdjustments {
                  adjustmentValue {
                    __typename
                    ... on SellingPlanPercentagePriceAdjustment {
                      adjustmentPercentage
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    ...ProductCardFields
    description
    descriptionHtml
    ingredients: metafield(namespace: "custom", key: "inhaltsstoffe_tab") {
      type
      value
    }
    updatedAt
    seo {
      title
      description
    }
    options {
      name
      values
    }
    images(first: 12) {
      edges {
        node {
          ...ImageFields
        }
      }
    }
    collections(first: 10) {
      edges {
        node {
          handle
          title
        }
      }
    }
    sellingPlanGroups(first: 3) {
      edges {
        node {
          name
          options {
            name
            values
          }
          sellingPlans(first: 10) {
            edges {
              node {
                id
                name
                recurringDeliveries
                options {
                  name
                  value
                }
                priceAdjustments {
                  adjustmentValue {
                    __typename
                    ... on SellingPlanPercentagePriceAdjustment {
                      adjustmentPercentage
                    }
                    ... on SellingPlanFixedAmountPriceAdjustment {
                      adjustmentAmount {
                        ...MoneyFields
                      }
                    }
                    ... on SellingPlanFixedPriceAdjustment {
                      price {
                        ...MoneyFields
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          requiresShipping
          price {
            ...MoneyFields
          }
          compareAtPrice {
            ...MoneyFields
          }
          selectedOptions {
            name
            value
          }
          image {
            ...ImageFields
          }
          sellingPlanAllocations(first: 10) {
            edges {
              node {
                sellingPlan {
                  id
                  name
                }
                priceAdjustments {
                  price {
                    ...MoneyFields
                  }
                  compareAtPrice {
                    ...MoneyFields
                  }
                }
              }
            }
          }
          storeAvailability(first: 5) {
            edges {
              node {
                available
                pickUpTime
                location {
                  name
                  address {
                    address1
                    city
                    zip
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFields
      }
      totalAmount {
        ...MoneyFields
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...MoneyFields
            }
            compareAtAmountPerQuantity {
              ...MoneyFields
            }
          }
          sellingPlanAllocation {
            sellingPlan {
              id
              name
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              requiresShipping
              selectedOptions {
                name
                value
              }
              image {
                ...ImageFields
              }
              product {
                handle
                title
                featuredImage {
                  ...ImageFields
                }
                biomarkers: metafield(namespace: "custom", key: "biomarkers") {
                  value
                }
                sampleMaterial: metafield(namespace: "custom", key: "sample_material") {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;
