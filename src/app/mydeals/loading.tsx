import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto py-6">
      {/* Page Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Filters Section Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex gap-3 items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Kanban Board Skeleton */}
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-18rem)]">
        {/* Generate 4 columns */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-1 min-w-80">
            <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="space-y-4 overflow-y-auto flex-grow">
                {/* Generate 3 cards per column */}
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="space-y-3">
                      <div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-full rounded-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
