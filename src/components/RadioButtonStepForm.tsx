"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddLeadContext } from "@/contexts/addDealContext";

interface RadioInputProps {
  label: string;
  id: string;
  options: string[];
  errorMsg?: string;
}

export default function RadioInput({
  label,
  id,
  options,
  errorMsg,
}: RadioInputProps) {
  const { updateNewLeadDetails, newLeadData } = useAddLeadContext();

  const selectedValue =
    (newLeadData[id as keyof typeof newLeadData] as string) || "";

  const handleChange = (value: string) => {
    updateNewLeadDetails({
      [id]: value,
    });
  };

  return (
    <div>
      <Label className="block text-black text-lg mb-2">{label}</Label>
      <RadioGroup value={selectedValue} onValueChange={handleChange} name={id}>
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
    </div>
  );
}
