"use server";
import { revalidateTag } from "next/cache";

export async function createDealNote(dealId: string, body: string) {
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
          timestamp: Date.now(),
        },
        associations: {
          dealIds: [parseInt(dealId)],
        },
        metadata: {
          body,
        },
      }),
    });

    if (response.ok) {
      revalidateTag("engagements");
      return await response.json();
    } else {
      const data = await response.json();
      return { error: "Failed to create note", details: data };
    }
  } catch (error) {
    console.error("Error creating deal note:", error);
    return null;
  }
}
