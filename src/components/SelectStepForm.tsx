"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAddLeadContext } from "@/contexts/addDealContext";
import { useState } from "react";

interface SelectInputProps {
  label: string;
  id: string;
  options: { label: string; value: string }[];
  placeholder: string;
  errorMsg?: string;
}

export default function SelectInput({
  label,
  id,
  options,
  placeholder,
  errorMsg,
}: SelectInputProps) {
  const { updateNewLeadDetails, newLeadData } = useAddLeadContext();
  const [selectedValue, setSelectedValue] = useState<string>(() => {
    // Inicializar con el valor del contexto si está disponible
    return String(newLeadData[id as keyof typeof newLeadData]) || "";
  });

  const handleChange = (value: string) => {
    setSelectedValue(value);
    updateNewLeadDetails({ [id]: value });
  };
  const currentValue =
    String(newLeadData[id as keyof typeof newLeadData]) || "";
  return (
    <div>
      <Label className="block text-black text-lg" htmlFor={id}>
        {label}
      </Label>
      <Select
        onValueChange={handleChange}
        name={id}
        defaultValue={currentValue}
        value={selectedValue}
      >
        <SelectTrigger
          id={id}
          className={`w-full rounded-md py-4 px-2 text-slate-900 border-2 ${
            errorMsg ? "border-red-500" : "border-slate-300"
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
