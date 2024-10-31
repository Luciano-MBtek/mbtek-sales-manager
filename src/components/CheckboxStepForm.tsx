// components/CheckboxInput.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAddDealContext } from "@/contexts/addDealContext";

interface CheckboxInputProps {
  label: string;
  id: string;
  options: string[];
  errorMsg?: string;
  isMulti?: boolean;
}

export default function CheckboxInput({
  label,
  id,
  options,
  errorMsg,
  isMulti = true,
}: CheckboxInputProps) {
  const { updateNewDealDetails, newDealData } = useAddDealContext();

  const selectedValues = newDealData[id as keyof typeof newDealData]
    ? typeof newDealData[id as keyof typeof newDealData] === "string"
      ? (newDealData[id as keyof typeof newDealData] as string).split(",")
      : (newDealData[id as keyof typeof newDealData] as string[])
    : [];

  const handleChange = (checked: boolean, value: string) => {
    let updatedValues: string[] = [];

    if (isMulti) {
      if (checked) {
        updatedValues = [...selectedValues, value];
      } else {
        updatedValues = selectedValues.filter((item) => item !== value);
      }
    } else {
      updatedValues = checked ? [value] : [];
    }

    updateNewDealDetails({
      [id]: isMulti ? updatedValues.join(",") : updatedValues[0] || "",
    });
  };

  return (
    <div>
      <Label className="block text-black text-lg mb-2">{label}</Label>
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
