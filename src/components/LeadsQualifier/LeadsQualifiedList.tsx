import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadsQualifiedContent } from "./LeadQualificationContent";

export function LeadsQualifiedList() {
  return (
    <Suspense fallback={<LeadsQualifiedSkeleton />}>
      <LeadsQualifiedContent />
    </Suspense>
  );
}

export function LeadsQualifiedSkeleton() {
  return (
    <div className="flex flex-col w-full gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border-slate-200">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 bg-slate-200" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-40 bg-slate-200" />
            <Skeleton className="h-4 w-28 bg-slate-200" />
            <Skeleton className="h-4 w-36 bg-slate-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
