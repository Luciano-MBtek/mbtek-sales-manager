"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown, Phone } from "lucide-react";
import React, { forwardRef, useMemo, useState } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

interface PhoneInputFormProps {
  errorMsg?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  label: boolean;
}

export default function PhoneInputForm({
  errorMsg,
  onChange,
  value,
  id,
  name,
  label,
}: PhoneInputFormProps) {
  const normalizedValue = useMemo(() => {
    if (!value) return "";
    // If it's already a valid E.164 format (starts with +), clean it
    if (value.startsWith("+")) {
      // Remove all spaces, dashes and other non-digit characters except the leading +
      return "+" + value.slice(1).replace(/\D/g, "");
    }
    // If it starts with a number (and not with +), assume it's a number without the + prefix
    if (/^\d+$/.test(value)) return `+${value}`;

    // For any other format, try to extract just the digits
    const digits = value.replace(/\D/g, "");
    if (digits) return `+${digits}`;

    return value;
  }, [value]);
  return (
    <div className="space-y-2" dir="ltr">
      {label && (
        <Label className="block text-zinc-700 text-md mb-2" htmlFor={id}>
          Phone number input
        </Label>
      )}
      <input type="hidden" name={name} value={normalizedValue} />
      <RPNInput.default
        className="flex rounded-lg shadow-sm text-primary shadow-black/5"
        international
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={PhoneInput}
        placeholder="Enter phone number"
        value={normalizedValue}
        onChange={(newValue) =>
          onChange({
            target: {
              id: id,
              value: newValue || "",
              name: name,
            },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      />
      {label && (
        <div className="min-h-8">
          {errorMsg && (
            <span className="text-red-500 text-sm block">{errorMsg}</span>
          )}
        </div>
      )}
    </div>
  );
}

const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, id, ...props }, ref) => {
    return (
      <Input
        className={cn(
          "-ms-px rounded-s-none shadow-none focus-visible:z-10",
          className
        )}
        name={id}
        id={id}
        ref={ref}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  const filteredOptions = options.filter(
    (option) => option.value === "US" || option.value === "CA"
  );

  return (
    <div className="relative inline-flex items-center self-stretch rounded-s-lg border border-input bg-background py-2 pe-2 ps-3 text-muted-foreground transition-shadow focus-within:z-10 focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20 hover:bg-accent hover:text-foreground has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        <span className="text-muted-foreground/80">
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="absolute inset-0 text-sm opacity-0"
        aria-label="Select country"
      >
        <option key="default" value="">
          Select a country
        </option>
        {filteredOptions
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label}{" "}
              {option.value &&
                `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <Phone size={16} aria-hidden="true" />
      )}
    </span>
  );
};
