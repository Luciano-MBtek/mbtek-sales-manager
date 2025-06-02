import { getUserBatchTasks } from "@/actions/tasks/userBatchTasks";
import { TasksTable } from "./TasksTable";

type SearchParams = { timeRange?: "weekly" | "monthly" | "allTime" };

export async function OwnerTasksList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const timeRange = (searchParams.timeRange ?? "monthly") as
    | "weekly"
    | "monthly"
    | "allTime";

  const result = await getUserBatchTasks(timeRange);
  const tasks = result.tasks || [];
  const nextAfter = result.nextAfter;

  return (
    <TasksTable
      tasks={tasks}
      timeRange={timeRange}
      initialNextAfter={nextAfter}
    />
  );
}
