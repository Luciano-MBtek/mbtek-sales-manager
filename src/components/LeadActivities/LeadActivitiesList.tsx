import { ActivitiesTable } from "./ActivitiesTable";
import { getLeadsBatchActivities } from "@/actions/activities/leadsBatchActivities";

type SearchParams = {
  timeRange?: "weekly" | "monthly" | "allTime";
  filter?: string;
};

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
  console.log("Engagement:", JSON.stringify(activities, null, 2));
  return (
    <ActivitiesTable
      activities={activities}
      timeRange={timeRange}
      initialNextAfter={nextAfter}
    />
  );
}
