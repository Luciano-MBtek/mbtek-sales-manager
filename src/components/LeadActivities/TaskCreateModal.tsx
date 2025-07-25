"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { taskTypeLabels, taskPriorityLabels } from "@/types/Tasks";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createTaskSchema, createTaskSchemaType } from "@/schemas/TaskSchema";
import { getAllOwners, OwnersArray } from "@/actions/getAllOwners";
import { useQuery } from "@tanstack/react-query";
import Tiptap from "@/components/Email/Tiptap";
import TimePicker from "@/components/TimePicker";
import { Engagement } from "./utils";

interface TaskCreateModalProps {
  engagement: Engagement;
  onCreateTask: (taskData: any) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const isSuccessResponse = (
  response: any
): response is {
  message: string;
  quantity: number;
  data: OwnersArray;
} => {
  return "data" in response;
};

export function TaskCreateModal({
  engagement,
  onCreateTask,
  isOpen,
  onOpenChange,
}: TaskCreateModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("00:00");
  const [selectedTeam, setSelectedTeam] = useState<string>("All Teams");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    }
  };

  const { isLoading, data: ownersData } = useQuery({
    queryKey: ["allOwners"],
    queryFn: async () => {
      const allOwners = await getAllOwners();
      return allOwners;
    },
  });

  const { toast } = useToast();

  const form = useForm<createTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      hs_task_subject: "",
      hs_task_body: "",
      hs_task_type: "",
      hs_task_priority: "",
      hubspot_owner_id: "",
      hs_timestamp: "",
      contactId: engagement?.contactsData?.[0]?.id || "",
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCalendarOpen &&
        calendarRef.current &&
        buttonRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Reset form when opening modal
  useEffect(() => {
    if (isOpen) {
      form.reset({
        hs_task_subject: "",
        hs_task_body: "",
        hs_task_type: "",
        hs_task_priority: "",
        hubspot_owner_id: "",
        hs_timestamp: "",
        contactId: engagement?.contactsData?.[0]?.id || "",
      });

      setSelectedDate(undefined);
      setSelectedTime("");
    }
  }, [form, isOpen, engagement]);

  const handleSubmit = (values: createTaskSchemaType) => {
    startTransition(async () => {
      try {
        onCreateTask(values);

        setIsOpen(false);

        toast({
          title: "Success",
          description: "Task created successfully",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create task",
          variant: "destructive",
        });
      }
    });
  };

  const getAllTeams = () => {
    if (!ownersData || !isSuccessResponse(ownersData)) return [];

    const teamsSet = new Set<string>();
    ownersData.data.forEach((owner) => {
      owner.teams?.forEach((team) => {
        teamsSet.add(team.name);
      });
    });
    return Array.from(teamsSet);
  };

  const getOwnersByTeam = (teamName: string) => {
    if (!ownersData || !isSuccessResponse(ownersData)) return [];

    if (teamName === "No Team") {
      return ownersData.data.filter(
        (owner) => !owner.teams || owner.teams.length === 0
      );
    }

    return ownersData.data.filter((owner) =>
      owner.teams?.some((team) => team.name === teamName)
    );
  };

  const handleCreateTask = () => {
    let timestamp = new Date().toISOString();
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(hours, minutes);
      timestamp = combinedDate.toISOString();
    }

    form.setValue("hs_timestamp", timestamp);

    form.handleSubmit(handleSubmit)();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-teal-500 text-white p-4 -m-6 mb-6">
          <DialogTitle className="text-xl font-semibold">
            Create Task
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Task Title */}
            <FormField
              control={form.control}
              name="hs_task_subject"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Task Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter task title"
                      className="min-h-[80px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Hidden contact ID field */}
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Task Body */}
            <FormField
              control={form.control}
              name="hs_task_body"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Task Body <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Tiptap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Task Type and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hs_task_type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Task Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(taskTypeLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hs_task_priority"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Priority <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(taskPriorityLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Assigned to */}
            <div className="space-y-4">
              {/* Team Selection */}
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Select Team
                </FormLabel>
                <Select
                  value={selectedTeam}
                  onValueChange={(value) => setSelectedTeam(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Teams">All Teams</SelectItem>
                    <SelectItem value="No Team">No Team</SelectItem>
                    {getAllTeams().map((team, index) => (
                      <SelectItem key={`${team}-${index}`} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              {/* Owner Selection */}
              <FormField
                control={form.control}
                name="hubspot_owner_id"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Assigned to
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(selectedTeam === "All Teams"
                          ? isSuccessResponse(ownersData)
                            ? ownersData.data
                            : []
                          : getOwnersByTeam(selectedTeam)
                        ).map((owner) => (
                          <SelectItem key={owner.id} value={owner.id}>
                            {`${owner.firstName} ${owner.lastName}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Due date */}
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Due date
              </FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <div className="relative">
                    <Button
                      type="button"
                      ref={buttonRef}
                      variant="outline"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "MM/dd/yyyy")
                        : "Select date"}
                    </Button>

                    {isCalendarOpen && (
                      <div
                        ref={calendarRef}
                        className="absolute bottom-full left-0 z-[9999] mt-1 bg-white border rounded-md shadow-lg p-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (date) {
                              setSelectedDate(date);
                              setIsCalendarOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </div>
                    )}
                  </div>
                </FormItem>
                <FormItem>
                  <TimePicker
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    label=""
                  />
                </FormItem>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleCreateTask}
              >
                {isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
