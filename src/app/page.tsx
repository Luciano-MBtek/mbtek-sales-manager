// src/app/page.tsx
import PageHeader from "@/components/PageHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import QualificationButton from "@/components/Modals/LeadQualification/QualificationButton";
import { LeadCountCard } from "@/components/LeadsQualifier/LeadsCountCard";
import { DealsSummaryCards } from "@/components/SalesOverview/DealsSummaryCards";
import { DealsWonLostChart } from "@/components/SalesOverview/DealsWonLostChart";
import TodayMeetingsCard from "@/components/SalesOverview/TodayMeetingsCard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const pipeline = typeof params.pipeline === "string" ? params.pipeline : params.pipeline?.[0];
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "User";
  const accessLevel = session?.user?.accessLevel;

  const firstname = userName.split(" ")[0];

  const title =
    accessLevel === "lead_agent"
      ? "Lead Qualification Dashboard"
      : accessLevel === "sales_agent"
        ? "Sales Overview"
        : "Lead Qualification Dashboard";

  return (
    <div className="flex flex-col w-full h-full mt-[--header-height]">
      <PageHeader title={title} subtitle={`Welcome back, ${firstname}.`} />
      {accessLevel === "lead_agent" && (
        <div className="flex flex-col w-full gap-4">
          <div>
            <QualificationButton />
          </div>
          <div className="w-[250px]">
            <LeadCountCard />
          </div>
        </div>
      )}
      {accessLevel === "sales_agent" && (
        <div className="flex flex-col w-full gap-4">
          <DealsSummaryCards />
          <DealsWonLostChart pipeline={pipeline} />
          <TodayMeetingsCard />
        </div>
      )}
    </div>
  );
}

export default HomePage;
