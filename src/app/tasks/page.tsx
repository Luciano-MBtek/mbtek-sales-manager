import { DateRangeSelect } from "@/components/DateRangeSelect";
import { OwnerTasksList } from "@/components/OwnerTasks/OwnerTasksList";
import PageHeader from "@/components/PageHeader";

type SearchParams = { timeRange?: "weekly" | "monthly" | "daily" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="flex flex-col w-full h-full mt-[--header-height]">
      <div className="w-full flex items-center justify-between">
        <PageHeader
          title="Tasks"
          subtitle="Check all your tasks."
          className="w-[500px]"
        />
        <DateRangeSelect />
      </div>
      <div className="w-full pr-4">
        <OwnerTasksList searchParams={params} />
      </div>
    </div>
  );
}
