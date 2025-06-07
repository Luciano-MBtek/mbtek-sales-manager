import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsSkeleton } from "@/components/LeadsAnalytics/AnalyticsSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full h-full mt-[--header-height]">
      <div className="w-full flex items-center justify-between">
        {/* Page Header Skeleton */}
        <div className="w-[500px]">
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        {/* Date Range Select Skeleton */}
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Analytics Cards Skeletons */}
      <div className="flex w-full gap-4 justify-between mt-4">
        <AnalyticsSkeleton />
        <AnalyticsSkeleton />
        <AnalyticsSkeleton />
        <AnalyticsSkeleton />
      </div>

      {/* Chart Skeleton */}
      <div className="w-full flex items-center justify-center mt-4">
        <Skeleton className="h-[350px] w-full rounded-lg" />
      </div>
    </div>
  );
}
