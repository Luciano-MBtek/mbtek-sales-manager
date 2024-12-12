"use server";

export async function getHubspotOwnerId(identifier: string) {
  try {
    const isEmail = identifier.includes("@");
    const endpoint = isEmail
      ? `https://api.hubapi.com/crm/v3/owners?email=${identifier}`
      : `https://api.hubapi.com/crm/v3/owners/${identifier}`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      },
    });

    const data = await response.json();

    if (isEmail) {
      return data.results && data.results.length > 0
        ? data.results[0].id
        : null;
    } else {
      return data || null;
    }
  } catch (error) {
    console.error("Error fetching Hubspot owner:", error);
    return null;
  }
}
