"use server";

export async function searchProducts(id: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const filters = [];

    filters.push(
      {
        propertyName: "hs_object_id",
        operator: "EQ",
        value: id,
      },
      {
        propertyName: "weight",
        operator: "HAS_PROPERTY",
      },
      {
        propertyName: "class",
        operator: "HAS_PROPERTY",
      },
      {
        propertyName: "nmfc",
        operator: "HAS_PROPERTY",
      }
    );

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/products/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: filters,
            },
          ],
          properties: [
            "weight",
            "class",
            "width",
            "nmfc",
            "height",
            "length",
            "uom",
            "name",
            "hs_sku",
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.total === 0) {
      return 0;
    }
    return data.results || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}
