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

export interface MeetingAssociationResponse {
  results: {
    id: string;
    type: string;
  }[];
}

// https://api.hubapi.com/crm/v3/objects/meetings/39950624311

export async function getContactMeetings(
  contactId: number | number[]
): Promise<MeetingAssociationResponse | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  // Si es un array, procesamos cada ID individualmente
  if (Array.isArray(contactId)) {
    try {
      // Usamos Promise.all para hacer todas las solicitudes en paralelo
      const results = await Promise.all(
        contactId.map((id) => getContactMeetings(id))
      );

      // Combinamos los resultados
      const combinedResults: MeetingAssociationResponse = {
        results: [],
      };

      results.forEach((result) => {
        if (result && result.results) {
          combinedResults.results = [
            ...combinedResults.results,
            ...result.results,
          ];
        }
      });

      return combinedResults;
    } catch (error) {
      console.error("Error getting meetings for multiple contacts:", error);
      return null;
    }
  }

  // Procesamiento para un solo ID
  const url = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}/associations/meetings`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { tags: [`meeting-association-${contactId}`], revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Error retrieving meeting links for Hubspot contact: ${contactId}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in getMeetingsLink for user ${contactId}:`, error);
    return null;
  }
}
