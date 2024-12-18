"use server";

export async function getOwnerById(id: string) {
  const URL = `https://api.hubapi.com/crm/v3/owners/${id}`;

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      const data = await response.json();
      return { error: "Failed to retrieve data", details: data };
    }
  } catch (error) {
    console.error("Error fetching Hubspot owner:", error);
    return null;
  }
}
