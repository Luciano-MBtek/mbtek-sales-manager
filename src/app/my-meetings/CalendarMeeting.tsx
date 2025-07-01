"use client";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
} from "./full-calendar";
import { CalendarMonthView } from "@/components/Meetings/CalendarMonthView";
import { CalendarDayView } from "@/components/Meetings/CalendarDayView";
import { CalendarWeekView } from "@/components/Meetings/CalendarWeekView";
import { CalendarYearView } from "@/components/Meetings/CalendarYearView";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Meeting } from "@/types/meetingTypes";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types/calendarTypes";
import { MeetingDetailsDialog } from "./meeting-details-dialog";
import { AddMeetingDialog } from "./add-meeting-dialog";
import { Button } from "@/components/ui/button";
import { MeetingWithContacts } from "@/actions/searchOwnerMeetings";

type CalendarMeetingProps = {
  meetings: MeetingWithContacts[];
};

const CalendarMeeting = ({ meetings = [] }: CalendarMeetingProps) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<
    MeetingWithContacts | undefined
  >();
  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent | undefined
  >();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const events = meetings.map((meeting) => {
    const defaultDate = new Date("2023-01-01T00:00:00Z");

    const startTime = meeting.properties.hs_meeting_start_time
      ? new Date(meeting.properties.hs_meeting_start_time)
      : defaultDate;

    const endTime = meeting.properties.hs_meeting_end_time
      ? new Date(meeting.properties.hs_meeting_end_time)
      : new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour

    return {
      id: meeting.id,
      start: startTime,
      end: endTime,
      title: meeting.properties.hs_meeting_title || "Untitled Meeting",
      color: getColorForMeetingOutcome(meeting.properties.hs_meeting_outcome),
    };
  });

  const handleEventClick = (event: CalendarEvent) => {
    const meeting = meetings.find((m) => m.id === event.id);
    if (meeting) {
      setSelectedMeeting(meeting);
      setSelectedEvent(event);
      setIsDetailsDialogOpen(true);
    }
  };

  if (!isClient) {
    return <div className="h-dvh p-4 flex flex-col">Loading calendar...</div>;
  }

  return (
    <>
      <Calendar events={events} onEventClick={handleEventClick}>
        <div className="h-dvh p-4 flex flex-col">
          <div className="flex px-6 items-center gap-2 mb-6">
            <div className="flex-1">
              <CalendarViewTrigger
                className="aria-[current=true]:bg-accent"
                view="day"
              >
                Day
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="week"
                className="aria-[current=true]:bg-accent"
              >
                Week
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="month"
                className="aria-[current=true]:bg-accent"
              >
                Month
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="year"
                className="aria-[current=true]:bg-accent"
              >
                Year
              </CalendarViewTrigger>
            </div>

            <div className="flex flex-1 items-center justify-center gap-2">
              <CalendarCurrentDate />

              <CalendarPrevTrigger>
                <ChevronLeft size={20} />
                <span className="sr-only">Previous</span>
              </CalendarPrevTrigger>

              <CalendarTodayTrigger>Today</CalendarTodayTrigger>

              <CalendarNextTrigger>
                <ChevronRight size={20} />
                <span className="sr-only">Next</span>
              </CalendarNextTrigger>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                disabled={true}
                className="flex flex-col"
              >
                Add Meeting <span className="text-xs">Coming soon</span>
              </Button>
              <AddMeetingDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
              />
            </div>
          </div>

          <div className="flex-1 px-6 overflow-y-auto overflow-x-hidden">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>
        </div>
      </Calendar>

      <MeetingDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        meeting={selectedMeeting}
        calendarEvent={selectedEvent}
      />
    </>
  );
};

// Helper function to determine meeting color based on outcome
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

export default CalendarMeeting;
