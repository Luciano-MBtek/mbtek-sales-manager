"use server";

export async function getOwnerExtraData(email: string) {
  const URL = "https://api.hubapi.com/crm/v3/objects/contacts/search";
  const raw = JSON.stringify({
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email",
            operator: "EQ",
            value: `${email}`,
          },
        ],
      },
    ],
    properties: ["jobtitle", "phone"],
  });

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: raw,
      redirect: "follow",
    });

    if (response.ok) {
      const jsonData = await response.json();
      return jsonData.results[0].properties;
    } else {
      const data = await response.json();
      return { error: "Failed to retrieve data", details: data };
    }
  } catch (error) {
    console.error("Error fetching Hubspot owner:", error);
    return null;
  }
}
