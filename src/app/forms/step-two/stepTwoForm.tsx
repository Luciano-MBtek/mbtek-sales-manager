"use client";
import Input from "@/components/Input";
import SubmitButton from "../../../components/SubmitButton";
import { stepTwoFormAction } from "@/app/forms/step-two/actions";
import { useFormState } from "react-dom";
import { useState } from "react";
import { FormErrors, canadaProvinces, USStates, leadType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const initialState: FormErrors = {};

export default function StepTwoForm() {
  const [serverErrors, formAction] = useFormState(
    stepTwoFormAction,
    initialState
  );
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStateOrProvince, setSelectedStateOrProvince] = useState("");

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        <Input
          label="Phone Number"
          id="phone"
          required
          type="tel"
          description="Please enter a valid phone number (10 digits)"
          pattern="^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$"
          placeholder="123-456-7890"
          errorMsg={serverErrors?.phone}
        />
        <div>
          <label className="block text-black text-lg" htmlFor="country">
            Country
          </label>
          <Select
            onValueChange={(value) => setSelectedCountry(value)}
            name="country"
          >
            <SelectTrigger
              id="country"
              className="w-full rounded-md py-4 px-2 text-slate-900 border-slate-300 border-2"
            >
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USA">USA</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
            </SelectContent>
          </Select>
          <div className="min-h-8 mt-1">
            {serverErrors?.country && (
              <span className="text-red-500 text-sm block">
                {serverErrors.country}
              </span>
            )}
          </div>
        </div>

        {selectedCountry === "USA" && (
          <div>
            <label className="block text-black text-lg" htmlFor="state">
              State
            </label>
            <Select
              onValueChange={(value) => setSelectedStateOrProvince(value)}
              name="state"
            >
              <SelectTrigger
                id="state"
                className="w-full rounded-md py-4 px-2 text-slate-900 border-slate-300 border-2"
              >
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {USStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCountry === "Canada" && (
          <div>
            <label className="block text-black text-lg" htmlFor="province">
              Province
            </label>
            <Select
              onValueChange={(value) => setSelectedStateOrProvince(value)}
              name="province"
            >
              <SelectTrigger
                id="province"
                className="w-full rounded-md py-4 px-2 text-slate-900 border-slate-300 border-2"
              >
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                {canadaProvinces.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-black">
            Are you calling for a business or for yourself?
          </h3>
          <div className="space-y-2">
            {leadType.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 text-black"
              >
                <Checkbox id={option} name="leadType" value={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
          {serverErrors?.leadType && (
            <span className="text-red-500 text-sm block">
              {serverErrors.leadType}
            </span>
          )}
        </div>

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
