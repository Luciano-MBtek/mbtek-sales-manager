"use server";

export async function getHubspotOwnerId(email: string) {
  try {
    const response = await fetch(
      `https://api.hubapi.com/crm/v3/owners?email=${email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Hubspot owner:", error);
    return null;
  }
}
