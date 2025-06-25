"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meeting } from "@/types/meetingTypes";
import { MeetingDetailsDialog } from "@/app/my-meetings/meeting-details-dialog";
import { CalendarEvent } from "@/types/calendarTypes";

function getColorForMeetingOutcome(
  outcome?: string
): "default" | "blue" | "green" | "pink" | "purple" | undefined {
  switch (outcome) {
    case "COMPLETED":
      return "green";
    case "SCHEDULED":
      return "blue";
    case "RESCHEDULED":
      return "purple";
    case "NO_SHOW":
      return "pink";
    case "CANCELED":
      return "default";
    default:
      return "default";
  }
}

export default function TodayMeetingsClient({
  meetings,
}: {
  meetings: Meeting[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting>();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();

  const handleClick = (meeting: Meeting) => {
    const defaultDate = new Date("2023-01-01T00:00:00Z");
    const start = meeting.properties.hs_meeting_start_time
      ? new Date(meeting.properties.hs_meeting_start_time)
      : defaultDate;
    const end = meeting.properties.hs_meeting_end_time
      ? new Date(meeting.properties.hs_meeting_end_time)
      : new Date(start.getTime() + 60 * 60 * 1000);

    setSelectedMeeting(meeting);
    setSelectedEvent({
      id: meeting.id,
      start,
      end,
      title: meeting.properties.hs_meeting_title || "Untitled Meeting",
      color: getColorForMeetingOutcome(meeting.properties.hs_meeting_outcome),
    });
    setOpen(true);
  };

  return (
    <>
      <Card className="shadow-sm mr-4">
        <CardHeader>
          <CardTitle>Today&apos;s Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No meetings for today.
            </p>
          ) : (
            <ul className="space-y-2">
              {meetings.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => handleClick(m)}
                    className="text-left w-full hover:underline"
                  >
                    <span className="font-medium">
                      {m.properties.hs_meeting_start_time &&
                        new Date(
                          m.properties.hs_meeting_start_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      {" - "}
                      {m.properties.hs_meeting_title || "Untitled Meeting"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <MeetingDetailsDialog
        open={open}
        onOpenChange={setOpen}
        meeting={selectedMeeting}
        calendarEvent={selectedEvent}
      />
    </>
  );
}
