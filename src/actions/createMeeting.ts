"use server";

import { getUserAccessToken } from "@/actions/user/getAccessToken";
import { revalidatePath, revalidateTag } from "next/cache";
import { meetingSchema } from "@/schemas/meetingSchema";
import { createHubspotMeeting } from "./createHubspotMeeting";
import { GoogleEventResponse } from "@/types/meetingTypes";

// Create a Google Calendar event
export async function createGoogleCalendarEvent(formData: FormData) {
  const accessToken = await getUserAccessToken();

  if (!accessToken) {
    return { error: "No access token available" };
  }

  try {
    // Parse form data
    const title = formData.get("title") as string;
    console.log("Title:", title);

    const description = formData.get("description") as string;
    console.log("Description:", description);

    const location = formData.get("location") as string;
    console.log("Location:", location);

    const dateStr = formData.get("date") as string;
    console.log("Date String:", dateStr);

    const startTime = formData.get("startTime") as string;
    console.log("Start Time:", startTime);

    const endTime = formData.get("endTime") as string;
    console.log("End Time:", endTime);

    const date = new Date(dateStr);
    console.log("Date:", date);

    // Validate inputs
    const validationResult = meetingSchema.safeParse({
      title,
      description,
      location,
      date,
      startTime,
      endTime,
    });

    if (!validationResult.success) {
      return {
        error: "Invalid form data",
        validationErrors: validationResult.error.format(),
      };
    }

    const [startHour, startMinute = "0"] = startTime.split(":");
    const [endHour, endMinute = "0"] = endTime.split(":");

    const [year, month, day] = dateStr.split("-").map(Number);

    const startDateTime = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(parseInt(startHour)).padStart(2, "0")}:${String(parseInt(startMinute)).padStart(2, "0")}:00`;

    const endDateTime = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(parseInt(endHour)).padStart(2, "0")}:${String(parseInt(endMinute)).padStart(2, "0")}:00`;

    // Create meeting payload
    const event = {
      summary: title,
      description,
      location,
      start: {
        // Formato explícito YYYY-MM-DD sin conversión a UTC
        dateTime: startDateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    // Call Google Calendar API to create event
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Calendar API error:", errorData);
      return {
        error: "Failed to create meeting",
        details: errorData.error?.message || "Unknown error",
      };
    }

    const data: GoogleEventResponse = await response.json();

    console.log("Response:", data);

    const hubspotMeeting = await createHubspotMeeting({
      title,
      description,
      location,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      externalUrl: data.hangoutLink || "",
      externalId: data.id || "",
    });

    revalidateTag("meetings");
    revalidatePath("/my-meetings");

    return {
      success: true,
      eventId: data.id,
      eventLink: data.htmlLink,
      hubspotMeeting,
    };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return {
      error: "Failed to create calendar event",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
