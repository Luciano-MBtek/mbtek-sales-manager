"use client";

import Link from "next/link";
import { Bell, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIncompleteTasks } from "@/hooks/useIncompleteTasks";

export function TaskNotifications() {
  const { data: tasks } = useIncompleteTasks();
  const count = tasks?.length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="relative p-2">
          {count > 0 ? (
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
      <DropdownMenuContent align="end" className="w-56">
        {count > 0 ? (
          tasks?.map((task) => (
            <DropdownMenuItem key={task.id}>
              <Link href="/tasks" className="w-full">
                {task.properties.hs_task_subject}
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No pending tasks</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
