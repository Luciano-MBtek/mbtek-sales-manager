import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex w-full justify-between flex-col">
      <div className="flex gap-10 items-center justify-center">
        <Skeleton className="h-[305px] w-[30%] ml-12" />
        <Skeleton className="h-[72px] w-[70%] mr-12" />
      </div>
      <div className="flex h-[500px] w-full p-12">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};

export default Loading;
