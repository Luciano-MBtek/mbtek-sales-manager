import { useQuery } from "@tanstack/react-query";
import { getIncompleteTasks } from "@/actions/tasks/getIncompleteTasks";
import { Task } from "@/types/Tasks";

const ONE_HOUR = 1000 * 60 * 60;

export function useIncompleteTasks() {
  return useQuery<Task[]>({
    queryKey: ["incompleteTasks"],
    queryFn: getIncompleteTasks,
    staleTime: ONE_HOUR,
    gcTime: ONE_HOUR,
    refetchInterval: ONE_HOUR,
    refetchIntervalInBackground: true,
  });
}
