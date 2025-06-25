// src/app/page.tsx
import PageHeader from "@/components/PageHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import QualificationButton from "@/components/Modals/LeadQualification/QualificationButton";
import { LeadCountCard } from "@/components/LeadsQualifier/LeadsCountCard";

async function HomePage() {
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
    </div>
  );
}

export default HomePage;
