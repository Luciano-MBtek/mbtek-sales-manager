import { useCalendar, EventGroup } from "@/app/my-meetings/full-calendar";
import { TimeTable } from "./TimeTable";
import { setHours } from "date-fns";

export const CalendarDayView = () => {
  const { view, events, date } = useCalendar();

  if (view !== "day") return null;

  // Only hours from 9 to 17
  const hours = [...Array(12)].map((_, i) => setHours(date, i + 9));

  return (
    <div className="flex relative pt-2  h-full">
      <TimeTable />
      <div className="flex-1">
        {hours.map((hour) => (
          <EventGroup key={hour.toString()} hour={hour} events={events} />
        ))}
      </div>
    </div>
  );
};
