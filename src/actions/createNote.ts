"use server";
import { revalidateTag } from "next/cache";

//create an engagement of type note associated with contact

export async function createNote(contactId: string, body: string) {
  const URL = `https://api.hubapi.com/engagements/v1/engagements`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        engagement: {
          active: true,
          type: "NOTE",
          timestamp: new Date().getTime(),
        },
        associations: {
          contactIds: [parseInt(contactId)],
        },
        metadata: {
          body,
        },
      }),
    });

    if (response.ok) {
      revalidateTag("engagements");
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
