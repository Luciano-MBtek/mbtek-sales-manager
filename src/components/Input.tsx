"use client";

import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputProps {
  label: string;
  id: string;
  description?: string;
  required?: boolean;
  pattern?: string;
  type: string;
  minLength?: number;
  min?: number;
  max?: number;
  errorMsg?: string;
  placeholder?: string;
  value: string | number;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  id,
  required = false,
  pattern,
  type,
  minLength,
  min,
  max,
  description,
  errorMsg,
  placeholder = "",
  value,
  onChange,
  className,
}: InputProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="block text-zinc-700 text-md mb-2">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      )}
      <ShadcnInput
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md py-4 px-2 text-slate-900 border-2 ${
          errorMsg ? "border-red-500" : "border-slate-300"
        }`}
      />
      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
