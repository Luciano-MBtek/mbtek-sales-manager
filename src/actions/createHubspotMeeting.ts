"use server";
import { getHubspotOwnerIdSession } from "./user/getHubspotOwnerId";

type HubSpotMeetingResponse = {
  id?: string;
  properties?: any;
  error?: any;
};

export async function createHubspotMeeting({
  title,
  description,
  location,
  startDateTime,
  endDateTime,
  externalUrl,
  externalId,
}: {
  title: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  externalUrl: string;
  externalId: string;
}) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    // Get the HubSpot owner ID for the current user
    const hubspotOwnerId = await getHubspotOwnerIdSession();

    // Create the meeting payload for HubSpot
    const payload = {
      properties: {
        hs_meeting_title: title,
        hs_meeting_body: description,
        hs_meeting_location: location,
        hs_meeting_start_time: startDateTime.toISOString(),
        hs_meeting_end_time: endDateTime.toISOString(),
        hs_meeting_external_url: externalUrl,
        hubspot_owner_id: hubspotOwnerId,
        hs_timestamp: startDateTime.getTime(),
        hs_meeting_change_id: externalId,
        hs_meeting_outcome: "SCHEDULED",
      },
    };

    // Call HubSpot API to create the meeting
    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/meetings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("HubSpot API error:", errorData);
      return {
        error: "Failed to create meeting in HubSpot",
        details: errorData.message || "Unknown error",
      };
    }

    const data: HubSpotMeetingResponse = await response.json();
    console.log("HubSpot Meeting Response:", data);

    return {
      success: true,
      meetingId: data.id,
      meetingProperties: data.properties,
    };
  } catch (error) {
    console.error("Error creating HubSpot meeting:", error);
    return {
      error: "Failed to create meeting in HubSpot",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
