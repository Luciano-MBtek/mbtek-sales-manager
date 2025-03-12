export async function checkDealsExist(contactId: string): Promise<boolean> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}/associations/deal`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { tags: [`contact-deals`], revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Error verifying deal associations: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.results && data.results.length > 0;
  } catch (error) {
    console.error("Error en checkDealsExist:", error);
    throw new Error("Could not verify the existence of deals for the contact.");
  }
}
