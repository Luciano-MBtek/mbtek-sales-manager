// src/app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col w-full h-full mt-[--header-height]">
      {/* Page Header Skeleton */}
      <div className="mb-6 p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-36" />
      </div>

      {/* Sales Agent Dashboard Skeleton */}
      <div className="flex flex-col w-full gap-8 px-6">
        {/* Deal Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full pr-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm border-l-4 border-l-gray-300">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent className="py-3 px-5">
                <Skeleton className="h-7 w-14" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Deals Won/Lost Chart Skeleton */}
        <Card className="mr-4 mb-8">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
              <Skeleton className="h-full w-full opacity-40" />
            </div>
          </CardContent>
          <div className="p-6 flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </Card>

        {/* Today's Meetings Skeleton */}
        <Card className="shadow-sm mr-4 mb-6">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
