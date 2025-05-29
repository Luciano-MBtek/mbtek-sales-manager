"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, Loader2 } from "lucide-react";
import { addDays, subDays, subMonths, subWeeks, subYears } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DateRange = {
  label: string;
  value: string;
  getDateRange: () => { from: Date; to: Date };
};

export const dateRanges: DateRange[] = [
  {
    label: "Last day",
    value: "last-day",
    getDateRange: () => {
      const to = new Date();
      const from = subDays(to, 1);
      return { from, to };
    },
  },
  {
    label: "Last week",
    value: "last-week",
    getDateRange: () => {
      const to = new Date();
      const from = subWeeks(to, 1);
      return { from, to };
    },
  },
  {
    label: "Last month",
    value: "last-month",
    getDateRange: () => {
      const to = new Date();
      const from = subMonths(to, 1);
      return { from, to };
    },
  },
];

export function DateRangeSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize from URL params if available, otherwise use "last-month"
  const [selectedRange, setSelectedRange] = useState<string>(() => {
    const rangeParam = searchParams.get("range");
    if (rangeParam && dateRanges.some((r) => r.value === rangeParam)) {
      return rangeParam;
    }
    return "last-month";
  });

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);

    const selectedRangeObj = dateRanges.find((r) => r.value === value);
    if (selectedRangeObj) {
      const { from, to } = selectedRangeObj.getDateRange();

      const params = new URLSearchParams(searchParams.toString());
      params.set("range", value);
      params.set("from", from.toISOString());
      params.set("to", to.toISOString());

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
        router.refresh();
      });
    }
  };
  const getDisplayValue = () => {
    const selectedRangeObj = dateRanges.find((r) => r.value === selectedRange);
    return selectedRangeObj?.label || "Select time range";
  };

  // Set initial URL parameters if none exist
  useEffect(() => {
    if (!searchParams.has("from") && !searchParams.has("to")) {
      const initialRange = dateRanges.find((r) => r.value === selectedRange);
      if (initialRange) {
        const { from, to } = initialRange.getDateRange();

        const params = new URLSearchParams(searchParams.toString());
        params.set("range", selectedRange);
        params.set("from", from.toISOString());
        params.set("to", to.toISOString());

        router.push(`?${params.toString()}`, { scroll: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-[240px]">
      <Select value={selectedRange} onValueChange={handleRangeChange}>
        <SelectTrigger
          className={cn(
            "w-[200px]",
            isPending && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}
            <SelectValue placeholder="Select time range">
              {getDisplayValue()}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {dateRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
