import {
  generateWeekdays,
  useCalendar,
  getDaysInMonth,
} from "@/app/my-meetings/full-calendar";
import { cn } from "@/lib/utils";
import { format, getMonth, isSameDay, isSameMonth, setMonth } from "date-fns";
import { useMemo } from "react";

export const CalendarYearView = () => {
  const { view, date, today, locale, events, setDate, setView, onChangeView } =
    useCalendar();

  const months = useMemo(() => {
    if (!view) {
      return [];
    }

    return Array.from({ length: 12 }).map((_, i) => {
      return getDaysInMonth(setMonth(date, i));
    });
  }, [date, view]);

  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  // Function to check if a date has meetings
  const dateHasMeetings = (dateToCheck: Date) => {
    return events.some((event) => isSameDay(event.start, dateToCheck));
  };

  // Function to handle month click
  const handleMonthClick = (monthIndex: number) => {
    const newDate = setMonth(date, monthIndex);
    setDate(newDate);
    setView("month");
    onChangeView?.("month");
  };

  if (view !== "year") return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 overflow-auto h-full">
      {months.map((days, i) => (
        <div
          key={days[0].toString()}
          className="cursor-pointer"
          onClick={() => handleMonthClick(i)}
        >
          <span className="text-xl">{format(setMonth(date, i), "MMMM")}</span>

          <div className="grid grid-cols-7 gap-2 my-5">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid gap-x-2 text-center grid-cols-7 text-xs tabular-nums">
            {days.map((_date) => {
              const hasEvents = dateHasMeetings(_date);

              return (
                <div
                  key={_date.toString()}
                  className={cn(
                    getMonth(_date) !== i && "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "aspect-square grid place-content-center size-full tabular-nums",
                      isSameDay(today, _date) &&
                        getMonth(_date) === i &&
                        "bg-primary text-primary-foreground rounded-full",
                      hasEvents &&
                        getMonth(_date) === i &&
                        !isSameDay(today, _date) &&
                        "bg-orange-500/50 text-orange-700 rounded-full"
                    )}
                  >
                    {format(_date, "d")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
