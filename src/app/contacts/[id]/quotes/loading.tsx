import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex w-full justify-between flex-col">
      <Skeleton className="h-[100vh] w-full m-16" />
    </div>
  );
};

export default Loading;
