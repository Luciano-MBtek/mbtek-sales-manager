import { Skeleton } from "@/components/ui/skeleton";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

const Loading = () => {
  return (
    <div className="flex w-full mt-[--header-height] flex-col">
      <div className="bg-white shadow-sm w-full h-full flex flex-col rounded-b-lg">
        <div className="h-[90vh] overflow-y-auto p-4 relative flex-1">
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className={cn(
              "[mask-image:linear-gradient(to_bottom_left,white,transparent_70%,transparent)] p-2 absolute"
            )}
          />
          <div className="space-y-4">
            <Skeleton className="h-80 w-full rounded-lg mb-6" />

            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
