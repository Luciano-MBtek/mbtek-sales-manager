"use server";

import { getUserAccessToken } from "@/actions/user/getAccessToken";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteMeeting(
  hubspotMeetingId: string,
  googleMeetingId: string
) {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const accessToken = await getUserAccessToken();

  if (!apiKey) {
    return { error: "HUBSPOT_API_KEY is not defined" };
  }

  if (!accessToken) {
    return { error: "No Google access token available" };
  }

  try {
    // Delete Google Calendar event if URL exists
    if (googleMeetingId) {
      const googleResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleMeetingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!googleResponse.ok) {
        // If status is not 204 (No Content) or 200 (OK)
        console.error("Google Calendar API error:", googleResponse.status);
        if (googleResponse.status !== 404) {
          // Ignore 404 (already deleted)
          return {
            error: "Failed to delete Google Calendar event",
            details: `Status: ${googleResponse.status}`,
          };
        }
      }
    }

    // Delete the HubSpot meeting

    const deleteResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/meetings/${hubspotMeetingId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      console.error("HubSpot API error:", errorData);
      return {
        error: "Failed to delete meeting in HubSpot",
        details: errorData.message || "Unknown error",
      };
    }

    revalidateTag("meetings");
    revalidatePath("/my-meetings");

    return {
      success: true,
      message: "Meeting deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return {
      error: "Failed to delete meeting",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
