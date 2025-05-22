"use server";

export interface MeetingLink {
  id: string;
  slug: string;
  link: string;
  name: string;
  type: string;
  organizerUserId: string;
  userIdsOfLinkMembers: string[];
  defaultLink: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingsLinkResponse {
  total: number;
  results: MeetingLink[];
}

export async function getMeetingsLink(
  organizerUserId: number
): Promise<MeetingsLinkResponse | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/scheduler/v3/meetings/meeting-links?organizerUserId=${organizerUserId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { tags: [`meeting-links-${organizerUserId}`], revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Error retrieving meeting links for user ${organizerUserId}: ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      `Error in getMeetingsLink for user ${organizerUserId}:`,
      error
    );
    return null;
  }
}
