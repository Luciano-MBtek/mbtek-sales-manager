"use server";

const shopifyUrl = process.env.SHOPIFY_ADMIN_GRAPHQ_URL;
const accessToken = process.env.SHOPIFY_X_ACCESS_TOKEN;

export default async function getShopifyMainProduct(sku: string) {
  try {
    const response = await fetch(shopifyUrl!, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          productVariants(first: 1, query: "sku:${sku}") {
            edges {
              node {
                legacyResourceId
                sku
                title
                product{
                  title
                  description
                  legacyResourceId
                  onlineStorePreviewUrl
                }
              }
            }
          }
        }`,
        variables: {},
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Shopify product:", error);
    throw error;
  }
}
