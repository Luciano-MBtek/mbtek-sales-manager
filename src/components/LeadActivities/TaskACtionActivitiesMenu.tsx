"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import type { Engagement } from "./utils";
import { useRouter } from "next/navigation";
import { TaskCreateModal } from "@/components/LeadActivities/TaskCreateModal";
import { createTaskSchemaType } from "@/schemas/TaskSchema";
import { createTask } from "@/actions/tasks/createTask";

export function TaskActionActivitiesMenu({
  engagement,
}: {
  engagement: Engagement;
}) {
  const [open, setOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const handleCreateTask = async (taskData: createTaskSchemaType) => {
    setOpen(false);

    await createTask(taskData);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              setOpen(false);
              setIsCreateModalOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create task
          </DropdownMenuItem>

          {engagement?.contactsData?.[0]?.id && (
            <DropdownMenuItem
              className="flex items-center justify-center bg-black text-white"
              onSelect={() => {
                setOpen(false);
                router.push(`/contacts/${engagement?.contactsData?.[0].id}`);
              }}
            >
              Open Contact
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskCreateModal
        engagement={engagement}
        onCreateTask={handleCreateTask}
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}
