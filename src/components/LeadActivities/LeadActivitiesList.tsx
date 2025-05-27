import { ActivitiesTable } from "./ActivitiesTable";
import { getLeadsBatchActivities } from "@/actions/activities/leadsBatchActivities";

type SearchParams = { timeRange?: "weekly" | "monthly" | "allTime" };

export async function LeadsActivitiesList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const timeRange = (searchParams.timeRange ?? "monthly") as
    | "weekly"
    | "monthly"
    | "allTime";

  const result = await getLeadsBatchActivities(timeRange);
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
