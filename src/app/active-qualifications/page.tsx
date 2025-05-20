import { LeadsQualifiedList } from "@/components/LeadsQualifier/LeadsQualifiedList";
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
      <PageHeader
        title="Active Qualifications"
        subtitle="Manage your active qualifications"
      />
      <div className="w-full pr-4">
        <LeadsQualifiedList searchParams={params} />
      </div>
    </div>
  );
}
