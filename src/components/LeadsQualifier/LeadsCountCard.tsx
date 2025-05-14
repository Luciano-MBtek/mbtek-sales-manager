import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileCheck } from "lucide-react";
import { getLeadsCount } from "@/actions/hubspot/leadsCount";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LeadCountCard() {
  return (
    <Suspense fallback={<LeadCountSkeleton />}>
      <LeadCountContent />
    </Suspense>
  );
}

// Lead count content that fetches data
async function LeadCountContent() {
  const leadWeekCount = await getLeadsCount();

  return (
    <Card className="border-green-300 bg-green-50">
      <CardHeader className="flex flex-row items-center gap-2">
        <FileCheck className="h-5 w-5 text-green-500" />
        <CardTitle className="text-green-700">Leads Processed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-green-700 mb-1">
          {leadWeekCount}
        </div>
        <CardDescription className="text-green-600 font-medium">
          this week
        </CardDescription>
      </CardContent>
    </Card>
  );
}

// Skeleton loader for lead count card
function LeadCountSkeleton() {
  return (
    <Card className="border-green-300 bg-green-50">
      <CardHeader className="flex flex-row items-center gap-2">
        <FileCheck className="h-5 w-5 text-green-500" />
        <CardTitle className="text-green-700">Leads Qualified</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 bg-green-200 mb-1" />
        <Skeleton className="h-4 w-24 bg-green-200" />
      </CardContent>
    </Card>
  );
}
