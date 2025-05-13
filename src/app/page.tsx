// src/app/page.tsx
import PageHeader from "@/components/PageHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import QualificationButton from "@/components/Modals/LeadQualification/QualificationButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

async function HomePage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "User";
  const accessLevel = session?.user?.accessLevel;

  const firstname = userName.split(" ")[0];

  const title =
    accessLevel === "lead_agent"
      ? "Lead Qualification Dashboard"
      : accessLevel === "manager"
        ? "Sales Overview"
        : "Lead Qualification Dashboard";

  return (
    <div className="flex flex-col w-full h-full">
      <PageHeader title={title} subtitle={`Welcome back, ${firstname}.`} />
      {accessLevel === "lead_agent" && (
        <div className="flex flex-col w-full gap-4">
          <div>
            <QualificationButton />
          </div>

          <div className="w-[500px] items-center justify-center">
            <Card className=" border-blue-300 bg-blue-50">
              <CardHeader className="flex flex-row items-center gap-2">
                <CalendarClock className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-blue-700">Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-600 font-medium">
                  A new and improved dashboard experience is currently in
                  development. Soon new features and tools to help you manage
                  leads more efficiently!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
