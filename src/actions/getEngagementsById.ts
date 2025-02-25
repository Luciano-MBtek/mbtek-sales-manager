"use server";

export async function getEngagementsById(id: string) {
  const URL = `https://api.hubapi.com/engagements/v1/engagements/associated/contact/${id}`;

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 500,
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
    console.error("Error fetching engagements:", error);
    return null;
  }
}
