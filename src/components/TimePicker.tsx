import React, { useEffect, useMemo } from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  /** Time in HH:mm format. If undefined, current time will be used */
  selectedTime?: string;
  setSelectedTime: (t: string) => void;
  label?: string;
}

/* ────────────────────── utilities ────────────────────── */

const minuteOptions = ["00", "15", "30", "45"];

/** Rounds to the nearest 15 minutes to match the selector */
const roundToQuarter = (d: Date) => {
  const m = Math.round(d.getMinutes() / 15) * 15;
  return m === 60 ? 0 : m;
};

const getNowTime = () => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = roundToQuarter(now).toString().padStart(2, "0");
  return `${h}:${m}`;
};

/** Safe format 24h -> 12h (returns "" if input is invalid) */
const formatTime12Hour = (time24?: string): string => {
  if (!time24?.includes(":")) return "";
  const [h, m] = time24.split(":");
  const hours24 = parseInt(h, 10);
  if (Number.isNaN(hours24)) return "";
  const minutes = parseInt(m ?? "0", 10);
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

/* ────────────────────── component ────────────────────── */

const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  setSelectedTime,
  label = "Select Time",
}) => {
  // Memoize current time only once
  const defaultTime = useMemo(getNowTime, []);

  // Inject default time only on first render
  useEffect(() => {
    if (!selectedTime) {
      setSelectedTime(defaultTime);
    }
  }, [selectedTime, defaultTime, setSelectedTime]);

  // Always operate with a valid HH:mm string
  const time =
    selectedTime && selectedTime.includes(":") ? selectedTime : defaultTime;

  const [hourValue, minuteValue] = time.split(":");

  /* ──────────── mouse wheel handlers ──────────── */

  const handleHourWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const dir = e.deltaY < 0 ? 1 : -1;
    const newHour = (((parseInt(hourValue) + dir) % 24) + 24) % 24;
    setSelectedTime(`${newHour.toString().padStart(2, "0")}:${minuteValue}`);
  };

  const handleMinuteWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const idx = minuteOptions.indexOf(minuteValue);
    const dir = e.deltaY < 0 ? 1 : -1;
    const newIdx =
      ((((idx === -1 ? 0 : idx) + dir) % minuteOptions.length) +
        minuteOptions.length) %
      minuteOptions.length;
    setSelectedTime(`${hourValue}:${minuteOptions[newIdx]}`);
  };

  /* ──────────── render ──────────── */

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="flex items-center space-x-2">
        {/* Hours */}
        <div onWheel={handleHourWheel}>
          <Select
            value={hourValue}
            onValueChange={(h) => setSelectedTime(`${h}:${minuteValue}`)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={hourValue} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => {
                const val = i.toString().padStart(2, "0");
                return (
                  <SelectItem
                    key={val}
                    value={val}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    {val}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <span className="text-muted-foreground">:</span>

        {/* Minutes */}
        <div onWheel={handleMinuteWheel}>
          <Select
            value={minuteValue}
            onValueChange={(m) => setSelectedTime(`${hourValue}:${m}`)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={minuteValue} />
            </SelectTrigger>
            <SelectContent>
              {minuteOptions.map((m) => (
                <SelectItem
                  key={m}
                  value={m}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 12h View */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {formatTime12Hour(time)}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
