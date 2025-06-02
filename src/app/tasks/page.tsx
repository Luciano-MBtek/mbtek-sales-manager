import { OwnerTasksList } from "@/components/OwnerTasks/OwnerTasksList";
import PageHeader from "@/components/PageHeader";

type SearchParams = { timeRange?: "weekly" | "monthly" | "allTime" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="flex flex-col w-full h-full">
      <PageHeader title="Tasks" subtitle="Check all your tasks." />
      <div className="w-full pr-4">
        <OwnerTasksList searchParams={params} />
      </div>
    </div>
  );
}
