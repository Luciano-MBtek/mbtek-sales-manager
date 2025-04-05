"use client";

import { useRef, useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createGoogleCalendarEvent } from "@/actions/createMeeting";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { meetingSchema, MeetingSchemaType } from "@/schemas/meetingSchema";
import { cn } from "@/lib/utils";

interface AddMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const generateEndTimeOptions = (startTime: string) => {
  const [hour, minute] = startTime.split(":").map(Number);
  const options = [];

  // Agregar opciones para +15min, +30min, +45min y +1h
  const durations = [15, 30, 45, 60];

  for (const minutes of durations) {
    let newHour = hour;
    let newMinute = (minute || 0) + minutes;

    // Ajustar hora si los minutos superan 60
    if (newMinute >= 60) {
      newHour += Math.floor(newMinute / 60);
      newMinute = newMinute % 60;
    }

    // Verificar que no exceda la hora máxima (20:00)
    if (newHour > 20 || (newHour === 20 && newMinute > 0)) {
      continue;
    }

    const value = `${newHour}:${newMinute.toString().padStart(2, "0")}`;

    // Formatear la etiqueta en formato 12h (AM/PM)
    let label;
    if (newHour < 12) {
      label = `${newHour}:${newMinute.toString().padStart(2, "0")} AM`;
    } else if (newHour === 12) {
      label = `12:${newMinute.toString().padStart(2, "0")} PM`;
    } else {
      label = `${newHour - 12}:${newMinute.toString().padStart(2, "0")} PM`;
    }

    options.push({ value, label });
  }

  return options;
};

export function AddMeetingDialog({
  open,
  onOpenChange,
}: AddMeetingDialogProps) {
  const { toast } = useToast();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<MeetingSchemaType>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: new Date(),
      startTime: "",
      endTime: "",
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

  useEffect(() => {
    // Verificar si la fecha seleccionada es hoy
    const startTime = form.setValue("startTime", "");
    const endTime = form.setValue("endTime", "");

    const isToday = form.getValues("date")
      ? new Date(form.getValues("date")).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0)
      : false;

    if (isToday) {
      const currentHour = new Date().getHours();

      // Si la hora actual es >= 20, no permitir seleccionar horas para hoy
      if (currentHour >= 20) {
        // Desactivar los campos de tiempo o cambiar la fecha
        startTime;
        endTime;
        toast({
          title: "Info",
          description: "Meetings can only be scheduled between 8 AM and 8 PM.",
        });
      }
      // Si la hora actual está entre 8-20, solo mostrar opciones desde la hora actual
      else if (currentHour >= 8) {
        // Dejamos que el usuario elija, pero podemos agregar lógica para filtrar
        // horas pasadas si es necesario
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues("date"), toast]);

  const handleSubmit = async (values: MeetingSchemaType) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("description", values.description || "");
      formData.set("location", values.location || "");
      formData.set("date", format(values.date, "yyyy-MM-dd"));
      formData.set("startTime", values.startTime);
      formData.set("endTime", values.endTime);

      const result = await createGoogleCalendarEvent(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Meeting created successfully",
        });
        onOpenChange(false);
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create meeting",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create meeting",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Meeting</DialogTitle>
          <DialogDescription>
            Create a new meeting in your calendar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter meeting title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <div className="relative">
                      <Button
                        type="button"
                        ref={buttonRef}
                        variant="outline"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>

                      {isCalendarOpen && (
                        <div
                          ref={calendarRef}
                          className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-lg p-3"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setIsCalendarOpen(false);
                              }
                            }}
                            initialFocus
                            disabled={(date) => {
                              const day = date.getDay();
                              // 0 is Sunday, 6 is Saturday
                              return day === 0 || day === 6;
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Time</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedStartTime(value); // Actualizar el estado local
                            form.setValue("endTime", ""); // Limpiar el campo endTime
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Start" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(() => {
                              const isToday = form.getValues("date")
                                ? new Date(form.getValues("date")).setHours(
                                    0,
                                    0,
                                    0,
                                    0
                                  ) === new Date().setHours(0, 0, 0, 0)
                                : false;

                              const currentHour = new Date().getHours();

                              // Filtrar horas disponibles
                              return Array.from({ length: 13 }, (_, i) => i + 8)
                                .filter(
                                  (hour) => !isToday || hour > currentHour
                                )
                                .map((hour) => (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {hour < 12
                                      ? `${hour}:00 AM`
                                      : hour === 12
                                        ? "12:00 PM"
                                        : `${hour - 12}:00 PM`}
                                  </SelectItem>
                                ));
                            })()}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedStartTime}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="End" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedStartTime &&
                              generateEndTimeOptions(selectedStartTime).map(
                                (option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
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
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Meeting details..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Meeting location or URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Meeting"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
