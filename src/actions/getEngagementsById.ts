"use server";

import { sleep } from "@/lib/utils";
import { Engagement } from "@/types/engagementsTypes";

export async function getEngagementsById(id: string) {
  const baseURL = `https://api.hubapi.com/engagements/v1/engagements/associated/contact/${id}`;
  let allResults: Engagement[] = [];
  let hasMore = true;
  let offset = 0;

  try {
    while (hasMore) {
      const URL = `${baseURL}${offset ? `?offset=${offset}` : ""}`;
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        next: { tags: [`engagements`], revalidate: 300 },
      });

      if (response.ok) {
        const jsonData = await response.json();
        allResults = [...allResults, ...jsonData.results];
        hasMore = jsonData.hasMore;
        offset = jsonData.offset;
        if (hasMore) await sleep(100);
      } else {
        const data = await response.json();
        return { error: "Failed to retrieve data", details: data };
      }
    }
    return { results: allResults };
  } catch (error) {
    console.error("Error fetching engagements:", error);
    return null;
  }
}
