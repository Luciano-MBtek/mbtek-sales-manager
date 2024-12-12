"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QualifyButtonProps {
  onQualify: (value: "Yes" | "No") => void;
}

export default function QualifyButton({ onQualify }: QualifyButtonProps) {
  const [value, setValue] = useState<string>("");

  const handleValueChange = (newValue: string) => {
    if (!newValue) return;
    setValue(newValue);

    if (newValue === "qualify") {
      onQualify("Yes");
    } else if (newValue === "disqualify") {
      onQualify("No");
    }
  };

  return (
    <ToggleGroup
      className="flex gap-0 -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse mb-4"
      type="single"
      variant="outline"
      value={value}
      onValueChange={handleValueChange}
    >
      <ToggleGroupItem
        className={cn(
          "flex-1 rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10",
          "text-primary",
          "data-[state=on]:bg-green-500 data-[state=on]:text-white"
        )}
        value="qualify"
      >
        Qualify
      </ToggleGroupItem>

      <ToggleGroupItem
        className={cn(
          "flex-1 rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10",
          "text-primary",
          "data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground"
        )}
        value="disqualify"
      >
        Disqualify
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
