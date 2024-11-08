"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import React from "react";

interface TextAreaInputProps {
  label: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  errorMsg?: string;
  minLength?: number;
  maxLength?: number;
  description?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextAreaInput({
  label,
  id,
  placeholder = "",
  required = false,
  errorMsg,
  minLength,
  maxLength,
  description,
  value,
  onChange,
}: TextAreaInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="block text-black text-lg mb-2">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      )}
      <Textarea
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
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
