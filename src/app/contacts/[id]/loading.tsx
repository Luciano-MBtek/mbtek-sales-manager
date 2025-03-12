import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex w-full  justify-center flex-col gap-8">
      <Skeleton className="rounded-lg h-[172px] border  w-full max-w-4xl mx-auto" />
      <Skeleton className="rounded-lg h-[352px] border  w-full max-w-4xl mx-auto " />
    </div>
  );
};
export default Loading;
