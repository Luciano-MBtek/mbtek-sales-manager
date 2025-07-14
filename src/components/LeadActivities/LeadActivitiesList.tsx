import { ActivitiesTable } from "./ActivitiesTable";
import { getLeadsBatchActivities } from "@/actions/activities/leadsBatchActivities";

type SearchParams = {
  timeRange?: "weekly" | "monthly" | "allTime";
  filter?: string;
};

export async function LeadsActivitiesList({
  searchParams,
  hubspotId,
}: {
  searchParams: SearchParams;
  hubspotId?: string;
}) {
  const timeRange = (searchParams.timeRange ?? "monthly") as
    | "weekly"
    | "monthly"
    | "allTime";

  const result = await getLeadsBatchActivities(timeRange, undefined, hubspotId);
  const activities = result.engagements;
  const nextAfter = result.nextAfter;

  return (
    <ActivitiesTable
      activities={activities}
      timeRange={timeRange}
      initialNextAfter={nextAfter}
    />
  );
}
