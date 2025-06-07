"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Repeat, MoreHorizontal, Clock } from "lucide-react";
import { useTransition, useState } from "react";
import type { Task, TaskStatus } from "@/types/Tasks";
import { useToast } from "../ui/use-toast";
import { updateTaskStatus } from "@/actions/tasks/updateTaskStatus";
import { useRouter } from "next/navigation";
import { TaskUpdateModal } from "./TaskUpdateModal";
import { updateTask } from "@/actions/tasks/updateTask";
import { useQueryClient } from "@tanstack/react-query";

const ALL_STATUSES: TaskStatus[] = [
  "COMPLETED",
  "DEFERRED",
  "IN_PROGRESS",
  "NOT_STARTED",
  "WAITING",
];

const STATUS_CONFIG = {
  COMPLETED: { icon: Check, label: "Mark as completed" },
  DEFERRED: { icon: Clock, label: "Mark as deferred" },
  IN_PROGRESS: { icon: Clock, label: "Mark as in progress" },
  NOT_STARTED: { icon: Clock, label: "Mark as not started" },
  WAITING: { icon: Clock, label: "Mark as waiting" },
};

export function TaskActionsMenu({
  task,
  mutateLocal,
}: {
  task: Task;
  mutateLocal: (id: string, status: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const router = useRouter();

  const handleStatusUpdate = (status: TaskStatus) => {
    setOpen(false);
    startTransition(async () => {
      try {
        await updateTaskStatus(task.id, status);
        mutateLocal(task.id, status);
        queryClient.refetchQueries({ queryKey: ["incompleteTasks"] });
        toast({
          title: "Success",
          description: `Task marked as ${status.toLowerCase().replace("_", " ")}`,
          variant: "default",
        });
      } catch {
        toast({
          title: "Error",
          description: "HubSpot error – try again",
          variant: "destructive",
        });
      }
    });
  };

  const handleUpdateTask = async (
    taskId: string,
    updatedData: Partial<Task>
  ) => {
    setOpen(false);
    try {
      mutateLocal(
        taskId,
        updatedData?.properties?.hs_task_status ||
          task.properties.hs_task_status
      );
      const response = await updateTask(taskId, updatedData);
      queryClient.refetchQueries({ queryKey: ["incompleteTasks"] });
      if (response) {
        toast({
          title: "Success",
          description: "Task updated successfully",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      });
      console.error("Error updating task:", error);
    }
  };

  const currentStatus = task.properties.hs_task_status;

  const availableStatuses = ALL_STATUSES.filter(
    (status) => status !== currentStatus
  );

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {/* Status update options */}
          {availableStatuses.map((status) => {
            const StatusIcon = STATUS_CONFIG[status].icon;
            return (
              <DropdownMenuItem
                key={status}
                onSelect={() => handleStatusUpdate(status)}
              >
                <StatusIcon className="mr-2 h-4 w-4" />{" "}
                {STATUS_CONFIG[status].label}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => {
              setOpen(false);
              setIsUpdateModalOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" /> Update task
          </DropdownMenuItem>

          {task?.contactsData?.[0]?.id && (
            <DropdownMenuItem
              className="flex items-center justify-center bg-black text-white"
              onSelect={() => {
                setOpen(false);
                router.push(`/contacts/${task?.contactsData?.[0].id}`);
              }}
            >
              Open Contact
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskUpdateModal
        task={task}
        onUpdate={handleUpdateTask}
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
    </>
  );
}
