// src/app/page.tsx
import PageHeader from "@/components/PageHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import QualificationButton from "@/components/Modals/LeadQualification/QualificationButton";

async function HomePage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "User";
  const accessLevel = session?.user?.accessLevel;

  const firstname = userName.split(" ")[0];

  // TODO : Verify accessLevel for LEAD instead of owner.

  const title =
    accessLevel === "owner"
      ? "Lead Qualification Dashboard"
      : accessLevel === "manager"
        ? "Sales Overview"
        : "Lead Qualification Dashboard";

  return (
    <div className="flex flex-col w-full h-full">
      <PageHeader title={title} subtitle={`Welcome back, ${firstname}.`} />
      {accessLevel === "owner" && (
        <div className="flex w-full ">
          <QualificationButton />
        </div>
      )}
    </div>
  );
}

export default HomePage;
