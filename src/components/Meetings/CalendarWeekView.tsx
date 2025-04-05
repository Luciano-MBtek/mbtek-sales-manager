import { EventGroup, useCalendar } from "@/app/my-meetings/full-calendar";
import { cn } from "@/lib/utils";
import { addDays, format, isToday, setHours, startOfWeek } from "date-fns";
import { useMemo } from "react";
import { TimeTable } from "./TimeTable";

export const CalendarWeekView = () => {
  const { view, date, locale, events } = useCalendar();

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
    const weekDates = [];

    for (let i = 0; i < 5; i++) {
      // Only 5 days
      const day = addDays(start, i);
      const hours = Array.from({ length: 9 }).map((_, i) =>
        setHours(day, i + 9)
      ); // Hours 9-17
      weekDates.push(hours);
    }

    return weekDates;
  }, [date]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 5; i++) {
      // Only 5 days
      const result = addDays(startOfWeek(date, { weekStartsOn: 1 }), i); // Start from Monday
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  if (view !== "week") return null;

  return (
    <div className="flex flex-col relative  h-full">
      <div className="flex sticky top-0 bg-card z-10 border-b mb-3">
        <div className="w-12"></div>
        {headerDays.map((date, i) => (
          <div
            key={date.toString()}
            className={cn(
              "text-center flex-1 gap-1 pb-2 text-sm text-muted-foreground flex items-center justify-center",
              [0, 6].includes(i) && "text-muted-foreground/50"
            )}
          >
            {format(date, "E", { locale })}
            <span
              className={cn(
                "h-6 grid place-content-center",
                isToday(date) &&
                  "bg-primary text-primary-foreground rounded-full size-6"
              )}
            >
              {format(date, "d")}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid grid-cols-5 flex-1">
          {weekDates.map((hours, i) => {
            return (
              <div
                className="h-full text-sm text-muted-foreground border-l first:border-l-0"
                key={hours[0].toString()}
              >
                {hours.map((hour) => (
                  <EventGroup
                    key={hour.toString()}
                    hour={hour}
                    events={events}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
