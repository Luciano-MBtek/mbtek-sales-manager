"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxInputProps {
  label: string;
  id: string;
  options: string[];
  value: string | string[];
  onChange: (updatedValue: string | string[]) => void;
  errorMsg?: string;
  isMulti?: boolean;
}

export default function CheckboxInput({
  label,
  id,
  options,
  value,
  onChange,
  errorMsg,
  isMulti = true,
}: CheckboxInputProps) {
  const selectedValues: string[] = value
    ? Array.isArray(value)
      ? value
      : value.split(",")
    : [];

  const handleChange = (checked: boolean, optionValue: string) => {
    let updatedValues: string[] = [];

    if (isMulti) {
      if (checked) {
        updatedValues = [...selectedValues, optionValue];
      } else {
        updatedValues = selectedValues.filter((item) => item !== optionValue);
      }
    } else {
      updatedValues = checked ? [optionValue] : [];
    }

    const finalValue = isMulti ? updatedValues : updatedValues[0] || "";
    onChange(finalValue);
  };

  return (
    <div>
      <Label className="block text-zinc-700 text-md mb-2">{label}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${id}-${option}`}
              name={id}
              value={option}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) =>
                handleChange(checked as boolean, option)
              }
            />
            <Label htmlFor={`${id}-${option}`} className="text-black">
              {option}
            </Label>
          </div>
        ))}
      </div>
      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
