import { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import { getAllOwnersMeetings } from "@/actions/searchOwnerMeetings";
import CalendarMeeting from "./CalendarMeeting";

export const metadata: Metadata = {
  title: "My Deals",
  description: "Deals associated with contact owner.",
};

const MeetingsPage = async ({
  searchParams,
}: {
  searchParams: { hubspotId?: string };
}) => {
  const meetings = await getAllOwnersMeetings(searchParams?.hubspotId);

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="My Meetings"
        subtitle={`Track your activities and tasks.`}
      />
      <CalendarMeeting meetings={meetings} />
    </div>
  );
};

export default MeetingsPage;
