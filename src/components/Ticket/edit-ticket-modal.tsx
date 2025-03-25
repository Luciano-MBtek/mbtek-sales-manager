"use client";
import {
  TicketStatus,
  pipelines,
  categories,
  sourceType,
  PriorityLevel,
} from "./ticketTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector from "@/components/ui/multiselect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  updateTicketSchema,
  updateTicketSchemaType,
} from "@/schemas/ticketSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Ticket } from "@/types/ticketTypes";
import { updateTicket } from "@/actions/updateTicket";

interface EditTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket;
  onSubmit?: (data: updateTicketSchemaType) => void;
}

export function EditTicketModal({
  open,
  onOpenChange,
  ticket,
  onSubmit,
}: EditTicketModalProps) {
  const { toast } = useToast();
  const { data } = useSession();

  const userHubspotId = data?.user.hubspotOwnerId;
  const userName = data?.user.name;

  const [isPending, startTransition] = useTransition();

  const getTicketCategoryValues = () => {
    if (!ticket.properties?.hs_ticket_category) return [];

    if (ticket.properties.hs_ticket_category.includes(";")) {
      return ticket.properties.hs_ticket_category
        .split(";")
        .map((category) => category.trim());
    }

    return [ticket.properties.hs_ticket_category];
  };

  const form = useForm<updateTicketSchemaType>({
    mode: "onChange",
    resolver: zodResolver(updateTicketSchema),
    defaultValues: {
      name: ticket.properties?.subject || "",
      pipeline: ticket.properties?.hs_pipeline || "support_pipeline",
      status: ticket.properties?.hs_pipeline_stage || "1",
      category: getTicketCategoryValues(),
      description: ticket.properties?.content || "",
      source: ticket.properties?.source_type || "",
      owner: ticket.properties?.hubspot_owner_id || userHubspotId || "",
      priority: ticket.properties?.hs_ticket_priority || "",
      contactId: ticket.properties?.hubspot_owner_id || "",
      ticketId: ticket.id,
    },
  });

  useEffect(() => {
    if (ticket) {
      form.reset({
        name: ticket.properties?.subject || "",
        pipeline: ticket.properties?.hs_pipeline || "support_pipeline",
        status: ticket.properties?.hs_pipeline_stage || "1",
        category: getTicketCategoryValues(),
        description: ticket.properties?.content || "",
        source: ticket.properties?.source_type || "",
        owner: ticket.properties?.hubspot_owner_id || userHubspotId || "",
        priority: ticket.properties?.hs_ticket_priority || "",
        contactId: ticket.properties?.hubspot_owner_id || "",
        ticketId: ticket.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket, userHubspotId, form]);

  const getStatusByPipeline = (selectedPipelineValue: string) => {
    const selectedPipeline = pipelines.find(
      (p) => p.value === selectedPipelineValue
    );

    if (!selectedPipeline) {
      return [];
    }
    return TicketStatus.filter(
      (status) => status.pipeline === selectedPipeline.pipeline
    );
  };

  const handleSubmit = async (values: updateTicketSchemaType) => {
    try {
      startTransition(async () => {
        const result = await updateTicket({
          ...values,
          ticketId: ticket.id,
        });

        if (result && result.success) {
          toast({
            title: "Success",
            description: "Ticket updated successfully",
          });
          onOpenChange(false);
          if (onSubmit) {
            onSubmit(values);
          }
        } else {
          toast({
            title: "Error",
            description: result?.error || "Failed to update ticket",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update ticket",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-auto max-h-[90vh]">
        <DialogHeader className="bg-[#00bdb4] text-white p-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-medium">Edit Ticket</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="p-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ticket name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="border-gray-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket owner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userHubspotId && (
                        <SelectItem value={userHubspotId}>
                          {userName}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pipeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pipeline <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue(
                        "status",
                        getStatusByPipeline(value)[0]?.value || ""
                      );
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select pipeline" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pipelines.map((pipeline) => (
                        <SelectItem key={pipeline.label} value={pipeline.value}>
                          {pipeline.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ticket status <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getStatusByPipeline(form.getValues("pipeline")).map(
                        (status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      commandProps={{
                        label: "Select categories",
                      }}
                      value={field.value.map(
                        (value) =>
                          categories.find((cat) => cat.value === value) || {
                            value,
                            label: value,
                          }
                      )}
                      defaultOptions={categories}
                      placeholder="Select categories"
                      hideClearAllButton
                      hidePlaceholderWhenSelected
                      emptyIndicator={
                        <p className="text-center text-sm">No results found</p>
                      }
                      onChange={(value) =>
                        field.onChange(value.map((option) => option.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-gray-300 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sourceType.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PriorityLevel.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${priority.color}`}
                            ></div>
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end border-t border-gray-200 pt-4">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#00bdb4] hover:bg-[#00a59e]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="mr-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                    Updating...
                  </>
                ) : (
                  "Update Ticket"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
