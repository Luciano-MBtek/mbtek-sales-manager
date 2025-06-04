import { Skeleton } from "@/components/ui/skeleton";

const LoadingActivities = () => {
  return (
    <div className="container mx-auto py-10">
      {/* Page Header Skeleton */}
      <div className="w-full px-4 py-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="text-center sm:text-left">
            <Skeleton className="h-12 w-48 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      {/* Search Input Skeleton */}
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-[320px]" />
      </div>

      {/* Table Skeleton */}
      <div className="w-full">
        <div className="border rounded-lg">
          {/* Table Header */}
          <div className="border-b">
            <div className="grid grid-cols-6 gap-4 p-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>

          {/* Table Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b">
              <div className="grid grid-cols-6 gap-4 p-4">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-4 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingActivities;
