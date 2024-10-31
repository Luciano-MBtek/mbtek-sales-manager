"use client";
import Input from "@/components/Input";
import SubmitButton from "../../../components/SubmitButton";
import SelectInput from "@/components/SelectStepForm";
import CheckboxInput from "@/components/CheckboxStepForm";
import { stepTwoFormAction } from "@/app/forms/step-two/actions";
import { useFormState } from "react-dom";
import { useState } from "react";
import { FormErrors, canadaProvinces, USStates, leadType } from "@/types";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAddDealContext } from "@/contexts/addDealContext";

const initialState: FormErrors = {};

export default function StepTwoForm() {
  const [serverErrors, formAction] = useFormState(
    stepTwoFormAction,
    initialState
  );
  const { newDealData } = useAddDealContext();
  const [selectedStateOrProvince, setSelectedStateOrProvince] = useState("");

  const countryOptions = [
    { label: "USA", value: "USA" },
    { label: "Canada", value: "Canada" },
  ];

  const stateOptions = USStates.map((state) => ({
    label: state,
    value: state,
  }));
  const provinceOptions = canadaProvinces.map(({ label, value }) => ({
    label,
    value,
  }));

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        <Input
          label="Phone Number"
          id="phone"
          required
          type="tel"
          description="Please enter a valid phone number (10 digits)"
          placeholder="123-456-7890"
          errorMsg={serverErrors?.phone}
        />
        <SelectInput
          label="Country"
          id="country"
          options={countryOptions}
          placeholder="Select a country"
          errorMsg={serverErrors?.country}
        />

        {newDealData.country === "USA" && (
          <SelectInput
            label="State"
            id="state"
            options={stateOptions}
            placeholder="Select a state"
            errorMsg={serverErrors?.state}
          />
        )}

        {newDealData.country === "Canada" && (
          <SelectInput
            label="Province"
            id="province"
            options={provinceOptions}
            placeholder="Select a province"
            errorMsg={serverErrors?.province}
          />
        )}
        <CheckboxInput
          label="Are you calling for a business or for yourself?"
          id="leadType"
          options={leadType}
          errorMsg={serverErrors?.leadType}
          isMulti={false} // Cambia a true si deseas permitir múltiples selecciones
        />
        {/* <div className="space-y-2">
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
        </div> */}

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
