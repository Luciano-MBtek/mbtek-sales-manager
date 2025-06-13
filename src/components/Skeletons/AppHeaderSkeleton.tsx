import { Skeleton } from "@/components/ui/skeleton";

export function AppHeaderSkeleton() {
  return (
    <header className="flex fixed items-center justify-between w-full border-b bg-background/80 backdrop-blur-sm p-8 max-h-[--header-height] z-[9998]">
      <div className="flex items-center gap-3">
        <Skeleton className="w-[120px] h-[40px]" />
        <div className="h-8 w-px bg-border"></div>
        <Skeleton className="w-[220px] h-6" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="w-[130px] h-9" />
        <Skeleton className="w-[200px] h-9" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </header>
  );
}
