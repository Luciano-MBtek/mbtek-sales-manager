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
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ticketSchema, ticketSchemaType } from "@/schemas/ticketSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState, useTransition } from "react";
import { useContactStore } from "@/store/contact-store";
import { createTicket } from "@/actions/createTicket";
import { useQuery } from "@tanstack/react-query";
import { getAllOwners, OwnersArray } from "@/actions/getAllOwners";

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTicketModal({
  open,
  onOpenChange,
}: CreateTicketModalProps) {
  const { toast } = useToast();

  const { contact } = useContactStore();

  const contactId = contact?.id;

  const [isPending, startTransition] = useTransition();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { isLoading, data: ownersData } = useQuery({
    queryKey: ["allOwners"],
    queryFn: async () => {
      const allOwners = await getAllOwners();
      return allOwners;
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

  const form = useForm<ticketSchemaType>({
    mode: "onChange",
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: "",
      pipeline: "support_pipeline",
      status: "1",
      category: [],
      description: "",
      source: "",
      owner: "",
      priority: "",
      createDate: new Date(),
      contactId: contactId || "",
    },
  });

  useEffect(() => {
    if (contactId) {
      form.setValue("contactId", contactId);
    }
  }, [contactId, form]);

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

  const handleSubmit = async (values: ticketSchemaType) => {
    try {
      startTransition(async () => {
        const result = await createTicket(values);

        if (result.success) {
          toast({
            title: "Success",
            description: "Ticket created successfully",
          });
          onOpenChange(false);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create ticket",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create ticket",
        variant: "destructive",
      });
    }
  };

  const getRandomOwnerByPipeline = (pipeline: string) => {
    if (!ownersData || !("data" in ownersData)) return null;

    // Grupo 1: Support, Schematics, Pre-delivery
    const group1PipelineValues = ["0", "149497267", "148924448"];
    // Grupo 2: Post-Delivery, Help Desk
    const group2PipelineValues = ["149497353", "677828696"];

    let eligibleOwners: OwnersArray = [];

    if (group1PipelineValues.includes(pipeline)) {
      // Daniel, Jeffrey, y Jesus para grupo 1
      eligibleOwners = ownersData.data.filter(
        (owner) =>
          owner.email === "engineering@mbtek.com" ||
          owner.firstName === "Jeffrey" ||
          owner.firstName === "Jesus"
      );
      console.log("Owner:", eligibleOwners);
    } else if (group2PipelineValues.includes(pipeline)) {
      // Yen y Dave para grupo 2
      eligibleOwners = ownersData.data.filter(
        (owner) => owner.firstName === "Yen" || owner.firstName === "Dave"
      );
      console.log("Owner:", eligibleOwners);
    }

    if (eligibleOwners.length === 0) return null;

    // Seleccionar aleatoriamente un propietario
    const randomIndex = Math.floor(Math.random() * eligibleOwners.length);
    return eligibleOwners[randomIndex].id;
  };
  useEffect(() => {
    if (ownersData && "data" in ownersData) {
      const currentPipeline = form.getValues("pipeline");
      const randomOwner = getRandomOwnerByPipeline(currentPipeline);

      if (randomOwner) {
        // Forzar la actualización del campo owner
        form.setValue("owner", randomOwner, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("pipeline"), ownersData]);

  useEffect(() => {
    if (ownersData && "data" in ownersData && !form.getValues("owner")) {
      const initialPipeline = form.getValues("pipeline");
      const randomOwner = getRandomOwnerByPipeline(initialPipeline);

      if (randomOwner) {
        form.setValue("owner", randomOwner, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownersData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-auto max-h-[90vh]">
        <DialogHeader className="bg-[#00bdb4] text-white p-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-medium">
            Create Ticket
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="p-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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

                      // Asignar owner basado en el pipeline seleccionado
                      if (ownersData && "data" in ownersData) {
                        const randomOwner = getRandomOwnerByPipeline(value);
                        if (randomOwner) {
                          form.setValue("owner", randomOwner, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }
                      }
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
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket owner</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ownersData &&
                        "data" in ownersData &&
                        ownersData.data.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id}>
                            {owner.firstName} {owner.lastName}
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
                      value={undefined}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            <FormField
              control={form.control}
              name="createDate"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Create date</FormLabel>
                    <div className="relative">
                      <Button
                        type="button"
                        ref={buttonRef}
                        variant="outline"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-300",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <span className="mr-2">📅</span>
                        {field.value
                          ? format(field.value, "MM/dd/yyyy")
                          : "MM/DD/YYYY"}
                      </Button>

                      {isCalendarOpen && (
                        <div
                          ref={calendarRef}
                          className="absolute bottom-full left-0 z-[9999] mb-1 bg-white border rounded-md shadow-lg p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                form.setValue("createDate", date, {
                                  shouldValidate: true,
                                });
                                field.onChange(date);
                                setIsCalendarOpen(false);
                              }
                            }}
                            initialFocus
                            locale={enUS}
                            disabled={(date) => {
                              return (
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="flex justify-end border-t border-gray-200 pt-4">
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
                    Creating...
                  </>
                ) : (
                  "Create Ticket"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
