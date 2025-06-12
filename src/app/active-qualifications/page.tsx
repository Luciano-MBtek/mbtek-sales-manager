import { LeadsQualifiedList } from "@/components/LeadsQualifier/LeadsQualifiedList";
import PageHeader from "@/components/PageHeader";
import StartQualificationModal from "@/components/LeadsQualifier/StartQualificationModal";

type SearchParams = {
  timeRange?: "weekly" | "monthly" | "allTime";
  startQualification?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="flex flex-col w-full h-full mt-[--header-height]">
      <PageHeader
        title="Active Qualifications"
        subtitle="Manage your active qualifications"
      />
      {/* Trigger modal when URL contains startQualification */}
      <StartQualificationModal />
      <div className="w-full pr-4">
        <LeadsQualifiedList searchParams={params} />
      </div>
    </div>
  );
}
