import { LeadsActivitiesList } from "@/components/LeadActivities/LeadActivitiesList";
import PageHeader from "@/components/PageHeader";

type SearchParams = { timeRange?: "weekly" | "monthly" | "allTime" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="flex flex-col w-full h-full mt-[--header-height]">
      <PageHeader
        title="Activities"
        subtitle="Manage income lead communications"
      />
      <div className="w-full pr-4">
        <LeadsActivitiesList searchParams={params} />
      </div>
    </div>
  );
}
