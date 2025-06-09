"use client";

import Link from "next/link";
import { Bell, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIncompleteTasks } from "@/hooks/useIncompleteTasks";
import { taskStatusLabels } from "@/types/Tasks";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { getStatusBadgeVariant } from "./OwnerTasks/utils";

export function TaskNotifications() {
  const { data: tasks, isPending } = useIncompleteTasks();
  const count = tasks?.length ?? 0;
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button type="button" className="relative p-2">
          {isPending ? (
            <Bell className="h-5 w-5" />
          ) : count > 0 ? (
            <>
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {count}
              </span>
            </>
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <span className="sr-only">Tasks Notifications</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {count > 0 ? (
          <>
            <div className="border-b mt-2 pt-2 px-2 py-1.5 text-sm flex justify-between items-center font-medium">
              My tasks
            </div>
            {tasks?.map((task) => (
              <DropdownMenuItem
                key={task.id}
                className="flex flex-col items-start py-2"
                onClick={() => setOpen(false)}
              >
                <Link href={`/tasks?taskId=${task.id}`} className="w-full">
                  <div className="font-normal">
                    {task.properties.hs_task_subject}
                  </div>
                  <div className="flex items-center justify-between w-full mt-1 text-xs text-muted-foreground">
                    <Badge
                      variant={getStatusBadgeVariant(
                        task.properties.hs_task_status
                      )}
                      className="text-xs"
                    >
                      {taskStatusLabels[task.properties.hs_task_status]}
                    </Badge>
                    <span>
                      {task.createdAt &&
                        formatDistanceToNow(new Date(task.createdAt), {
                          addSuffix: true,
                        })}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <div className="border-t mt-2 pt-2 px-2 py-1.5 text-sm flex justify-between items-center">
              <span className="text-muted-foreground">
                {count} pending tasks
              </span>
              <Link
                href="/tasks"
                className="text-primary hover:underline"
                onClick={() => setOpen(false)}
              >
                View all
              </Link>
            </div>
          </>
        ) : (
          <DropdownMenuItem disabled>No pending tasks</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
