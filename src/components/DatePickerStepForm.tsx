"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAddLeadContext } from "@/contexts/addDealContext";

interface DatePickerProps {
  label: string;
  id: string;
  errorMsg?: string;
}
// formato que entra es YYYY-MM-DD
export function DatePickerForm({ label, id, errorMsg }: DatePickerProps) {
  const { updateNewLeadDetails, newLeadData } = useAddLeadContext();
  const [date, setDate] = useState<Date | undefined>(() => {
    const contextDate = newLeadData[id as keyof typeof newLeadData];
    if (typeof contextDate === "string") {
      const parsedDate = new Date(contextDate);
      // Check if the date is valid before returning it
      return !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
    }
    return undefined;
  });

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    updateNewLeadDetails({ [id]: newDate?.toISOString() });
  };

  return (
    <div>
      <Label className="block text-black text-lg" htmlFor={id}>
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal text-black",
              !date && "text-muted-foreground",
              errorMsg && "border-2 border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
