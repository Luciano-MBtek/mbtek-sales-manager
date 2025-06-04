import { getUserBatchTasks } from "@/actions/tasks/userBatchTasks";
import { TasksTable } from "./TasksTable";
import { Suspense } from "react";

type SearchParams = {
  range?: string;
  from?: string;
  to?: string;
  timeRange?: "weekly" | "monthly" | "daily";
};

export async function OwnerTasksList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let timeRange: "daily" | "weekly" | "monthly" = "monthly";

  if (searchParams.range === "last-day") {
    timeRange = "daily";
  } else if (searchParams.range === "last-week") {
    timeRange = "weekly";
  } else if (searchParams.range === "last-month") {
    timeRange = "monthly";
  }

  if (searchParams.timeRange) {
    timeRange = searchParams.timeRange as "daily" | "weekly" | "monthly";
  }

  const result = await getUserBatchTasks(
    timeRange,
    undefined,
    searchParams.from,
    searchParams.to
  );

  const tasks = result.tasks || [];
  const nextAfter = result.nextAfter;

  return (
    <Suspense fallback={<div>Loading table...</div>}>
      <TasksTable
        tasks={tasks}
        timeRange={timeRange}
        initialNextAfter={nextAfter}
      />
    </Suspense>
  );
}
