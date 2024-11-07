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
}

export default function RadioInput({
  label,
  id,
  options,
  value,
  onChange,
  errorMsg,
}: RadioInputProps) {
  return (
    <>
      <Label className="block text-black text-lg mb-2">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} name={id}>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${id}-${option}`} />
              <Label htmlFor={`${id}-${option}`} className="text-black">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        )}
      </div>
    </>
  );
}
