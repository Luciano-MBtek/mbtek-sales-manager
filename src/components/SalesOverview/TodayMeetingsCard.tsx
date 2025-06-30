import { getAllOwnersMeetings } from "@/actions/searchOwnerMeetings";
import { Meeting } from "@/types/meetingTypes";
import TodayMeetingsClient from "./TodayMeetingsClient";

export default async function TodayMeetingsCard() {
  const meetings = await getAllOwnersMeetings();

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const todaysMeetings = meetings.filter((m: Meeting) => {
    const start = m.properties.hs_meeting_start_time;
    if (!start) return false;
    const date = new Date(start);
    return date >= startOfDay && date < endOfDay;
  });

  return <TodayMeetingsClient meetings={todaysMeetings} />;
}
