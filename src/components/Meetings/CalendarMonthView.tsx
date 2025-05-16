"use client";
import { useMemo } from "react";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { monthEventVariants } from "@/app/my-meetings/full-calendar"; // You'll need to export this from full-calendar
import {
  getDaysInMonth,
  generateWeekdays,
  useCalendar,
} from "@/app/my-meetings/full-calendar";

export const CalendarMonthView = () => {
  const { date, view, events, locale, setDate, setView, onChangeView } =
    useCalendar();

  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== "month") return null;

  const handleDateClick = (_date: Date) => {
    setDate(_date);
    setView("day");
    onChangeView?.("day");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-5 gap-px sticky top-0 bg-background border-b">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className="mb-2 text-right text-sm text-muted-foreground pr-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-5 gap-px">
        {monthDates
          .filter((date) => {
            const day = date.getDay();
            return day > 0 && day < 6; // Only Monday (1) to Friday (5)
          })
          .map((_date) => {
            const currentEvents = events.filter((event) =>
              isSameDay(event.start, _date)
            );

            return (
              <div
                className={cn(
                  "ring-1 p-2 text-sm text-muted-foreground ring-border overflow-auto cursor-pointer",
                  !isSameMonth(date, _date) && "text-muted-foreground/50"
                )}
                key={_date.toString()}
                onClick={() => handleDateClick(_date)}
              >
                <span
                  className={cn(
                    "size-6 grid place-items-center rounded-full mb-1 sticky top-0",
                    isToday(_date) && "bg-primary text-primary-foreground"
                  )}
                >
                  {format(_date, "d")}
                </span>

                {currentEvents.map((event) => {
                  // Only show events between 9:00 and 17:00
                  const hour = event.start.getHours();
                  if (hour < 9 || hour >= 17) return null;

                  return (
                    <div
                      key={event.id}
                      className="px-1 rounded text-sm flex items-center gap-1"
                    >
                      <div
                        className={cn(
                          "shrink-0",
                          monthEventVariants({ variant: event.color })
                        )}
                      ></div>
                      <span className="flex-1 truncate">{event.title}</span>
                      <time className="tabular-nums text-muted-foreground/50 text-xs">
                        {format(event.start, "HH:mm")}
                      </time>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};
