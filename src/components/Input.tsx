"use client";

import { useAddDealContext } from "@/contexts/addDealContext";

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
}
export default function Input({
  label,
  id,
  required,
  pattern,
  type,
  minLength,
  min,
  max,
  description,
  errorMsg,
  placeholder,
}: InputProps) {
  const { updateNewDealDetails, newDealData } = useAddDealContext();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewDealDetails({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <label className="block text-black text-lg" htmlFor={id}>
        {label}
        {description && (
          <span className="text-sm text-slate-400 block mb-1">
            {description}
          </span>
        )}
      </label>
      <input
        className={`w-full rounded-md py-4 px-2 text-slate-900 ${
          errorMsg ? "border-red-500" : "border-slate-300"
        } border-2`}
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        max={max}
        onChange={handleInputChange}
        defaultValue={newDealData[id as keyof typeof newDealData]}
      />
      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
