const accessToken = process.env.HUBSPOT_API_KEY;

type ProductProperties = {
  price: number;
  name: string;
  hs_sku: string;
  hs_images: string;
};

type Product = {
  id: string;
  properties: ProductProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};

type ProductsArray = Product[];

export async function getAllProducts(): Promise<
  | {
      message: string;
      quantity: number;
      data: ProductsArray;
    }
  | {
      error: string;
    }
> {
  let after = "";
  let allResults: ProductsArray = [];
  const limit = 100;

  try {
    do {
      const url = `https://api.hubapi.com/crm/v3/objects/products?properties=price,name,hs_sku,hs_images&limit=${limit}${
        after ? `&after=${after}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        allResults = allResults.concat(data.results);
        after = data.paging?.next?.after || "";
      } else {
        const errorData = await response.json();
        console.error("Error retrieving data:", errorData);
        break;
      }
    } while (after);

    return {
      message: "All products have been retrieved",
      quantity: allResults.length,
      data: allResults,
    };
  } catch (error) {
    console.error("Error in the request:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
