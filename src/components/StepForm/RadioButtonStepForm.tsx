"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioInputProps {
  label: string;
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  errorMsg?: string;
  disabledOptions?: [string];
}

export default function RadioInput({
  label,
  id,
  options,
  value,
  onChange,
  errorMsg,
  disabledOptions,
}: RadioInputProps) {
  return (
    <>
      {label && label.trim() !== "" && (
        <Label className="block text-primary text-lg mb-2">{label}</Label>
      )}
      <RadioGroup value={value} onValueChange={onChange} name={id}>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                id={`${id}-${option}`}
                disabled={disabledOptions?.includes(option)}
              />
              <Label htmlFor={`${id}-${option}`} className="text-primary">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {errorMsg && (
        <div className="min-h-8 mt-1">
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        </div>
      )}
    </>
  );
}
