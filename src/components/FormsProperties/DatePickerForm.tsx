"use client";

import { useTransition, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { patchContactProperty } from "@/actions/patchContactProperty";

type DatePickerFormProps = {
  label: string;
  property: string;
  id: string;
};

export function DatePickerForm({ property, id }: DatePickerFormProps) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const onSelect = (date: Date | undefined) => {
    if (!date) return;

    setDate(date);
    startTransition(() => {
      const formattedDate = format(date, "yyyy-MM-dd");
      patchContactProperty(id, property, formattedDate)
        .then(() => {
          toast({
            title: `${property} updated successfully`,
            description: <p className="text-primary">{formattedDate}</p>,
          });
        })
        .catch((error) => {
          toast({
            title: "Error updating property",
            description: <p className="text-destructive">{error.message}</p>,
            variant: "destructive",
          });
        });
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Calendar
        mode="single"
        onSelect={onSelect}
        selected={date}
        disabled={(date) => isPending || date < new Date()}
        initialFocus
      />
    </div>
  );
}
