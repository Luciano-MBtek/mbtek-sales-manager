"use server";

export interface MeetingDetails {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  // Añadir otros campos según necesites
}

export async function getMeetingDetails(
  meetingId: string
): Promise<MeetingDetails | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/meetings/${meetingId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { tags: [`meeting-details-${meetingId}`], revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Error retrieving meeting details for ID: ${meetingId}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Error in getMeetingDetails for meeting ${meetingId}:`,
      error
    );
    return null;
  }
}
