import React from "react";
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
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  label?: string;
}

const formatTime12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  setSelectedTime,
  label = "Select Time",
}) => {
  // Default to current time if no time is selected
  if (!selectedTime) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setSelectedTime(`${hours}:${minutes}`);
  }

  const hourValue = selectedTime.split(":")[0] || "00";
  const minuteValue = selectedTime.split(":")[1] || "00";

  const handleHourWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const direction = e.deltaY < 0 ? 1 : -1;
    const currentHour = parseInt(hourValue);
    const newHour = (((currentHour + direction) % 24) + 24) % 24;
    setSelectedTime(`${newHour.toString().padStart(2, "0")}:${minuteValue}`);
  };

  const handleMinuteWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const minuteOptions = ["00", "15", "30", "45"];
    const currentIndex = minuteOptions.indexOf(minuteValue);
    const direction = e.deltaY < 0 ? 1 : -1;
    const newIndex = (((currentIndex + direction) % 4) + 4) % 4;
    setSelectedTime(`${hourValue}:${minuteOptions[newIndex]}`);
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex items-center space-x-2">
        <div onWheel={handleHourWheel}>
          <Select
            value={hourValue}
            onValueChange={(hour) => {
              setSelectedTime(`${hour}:${minuteValue}`);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={hourValue} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => (
                <SelectItem
                  key={i}
                  value={i.toString().padStart(2, "0")}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  {i.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-muted-foreground">:</span>
        <div onWheel={handleMinuteWheel}>
          <Select
            value={minuteValue}
            onValueChange={(minute) => {
              setSelectedTime(`${hourValue}:${minute}`);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={minuteValue} />
            </SelectTrigger>
            <SelectContent>
              {["00", "15", "30", "45"].map((minute) => (
                <SelectItem
                  key={minute}
                  value={minute}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {formatTime12Hour(selectedTime)}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
