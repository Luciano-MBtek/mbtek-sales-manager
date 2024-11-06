const accessToken = process.env.HUBSPOT_API_KEY;

type ProductProperties = {
  price: number;
  name: string;
  hs_sku: string;
};

type Product = {
  id: string;
  properties: ProductProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};

type ProductsArray = Product[];

export async function getAllProducts() {
  let after = "";
  let allResults: ProductsArray = [];
  const limit = 100;

  try {
    do {
      const url = `https://api.hubapi.com/crm/v3/objects/products?properties=price,name,hs_sku&limit=${limit}${
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
        console.error("Error al recuperar los datos:", errorData);
        break; // Salir del bucle en caso de error
      }
    } while (after);

    return {
      message: "Todos los productos han sido recuperados",
      quantity: allResults.length,
      data: allResults,
    };
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
