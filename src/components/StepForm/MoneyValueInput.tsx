"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface MoneyValueInputProps {
  label: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  errorMsg?: string;
  minValue?: number;
  maxValue?: number;
  description?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currency?: string;
}

export default function MoneyValueInput({
  label,
  id,
  placeholder = "$",
  required = false,
  errorMsg,
  minValue,
  maxValue,
  description,
  value,
  onChange,
}: MoneyValueInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="block text-black text-lg mb-2">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      )}
      <div className="relative">
        <Input
          type="text"
          pattern="[0-9]*\.?[0-9]*"
          inputMode="decimal"
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          min={minValue}
          max={maxValue}
          value={value}
          onKeyDown={(e) => {
            if (
              !/[0-9.]/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Tab" &&
              e.key !== "Delete" &&
              e.key !== "ArrowLeft" &&
              e.key !== "ArrowRight"
            ) {
              e.preventDefault();
            }
          }}
          onChange={onChange}
          className={`w-full pl-8 rounded-md py-4 px-2 text-slate-900 border-2 ${
            errorMsg ? "border-red-500" : "border-slate-300"
          }`}
        />
      </div>
      {errorMsg && (
        <div className="min-h-8 mt-1">
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
