"use client";

import SubmitButton from "@/components/SubmitButton";
import RadioInput from "@/components/StepForm/RadioButtonStepForm";
import { FormErrors } from "@/types";
import FormQuestion from "@/components/FormQuestion";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { stepOneFormAction } from "./actions";
import { CompleteSystem, useSystemStore } from "@/store/completeSystem-store";
import CheckboxInput from "@/components/StepForm/CheckboxStepForm";
import {
  installationTypeValues,
  unitReplacementTypesValues,
  technologyNeededValues,
  yesOrNoValues,
  unknownTechnologyValues,
} from "@/schemas/completeSystemSchema";
import Input from "@/components/Input";

const initialState: FormErrors = {};

export default function StepOneForm() {
  const [serverErrors, formAction] = useActionState(
    stepOneFormAction,
    initialState
  );

  const { completeSystem, update } = useSystemStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    update({ ...completeSystem, [name]: value } as CompleteSystem);
  };

  const handleSelectChange = (field: string) => (value: string) => {
    update({ ...completeSystem, [field]: value } as CompleteSystem);
  };
  const handleCheckboxChange =
    (fieldId: string) => (value: string | string[]) => {
      const valueArray = Array.isArray(value) ? value : [value];
      update({
        ...completeSystem,
        [fieldId]: valueArray,
      } as CompleteSystem);
    };

  return (
    <form
      action={formAction}
      className={cn(
        "flex flex-1 flex-col items-center p-4",
        Object.keys(serverErrors || {}).length > 0
          ? "border-2 border-red-500 bg-red-50 rounded"
          : " bg-white  "
      )}
    >
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        <FormQuestion question="Let's now dive into your project specifics so we can understand better and see what's needed. The process is around 10 minutes" />
        <FormQuestion question="Are you installing a complete new system only or will it be a retrofit?" />
        <RadioInput
          label=""
          id="installation_type"
          options={installationTypeValues}
          errorMsg={serverErrors?.installation_type}
          value={completeSystem?.installation_type || ""}
          onChange={handleSelectChange("installation_type")}
        />

        {completeSystem?.installation_type === "Retrofit" && (
          <CheckboxInput
            label="Unit Replacement type"
            id="unit_replacement_type"
            options={unitReplacementTypesValues}
            errorMsg={serverErrors?.unit_replacement_type}
            isMulti={true}
            value={completeSystem?.unit_replacement_type || []}
            onChange={handleCheckboxChange("unit_replacement_type")}
          />
        )}
        {completeSystem?.unit_replacement_type?.includes("Other") &&
          completeSystem?.installation_type === "Retrofit" && (
            <Input
              label="Other replacement type:"
              id="other_replacement_type"
              type="text"
              errorMsg={serverErrors?.other_replacement_type}
              onChange={handleInputChange}
              value={completeSystem?.other_replacement_type || ""}
              className="w-full"
            />
          )}

        <FormQuestion question="Do you already have one of our specific heating/cooling system in mind?" />
        <RadioInput
          label=""
          id="already_have_a_system_in_mind"
          options={yesOrNoValues}
          errorMsg={serverErrors?.already_have_a_system_in_mind}
          value={completeSystem?.already_have_a_system_in_mind || ""}
          onChange={handleSelectChange("already_have_a_system_in_mind")}
        />
        {completeSystem?.already_have_a_system_in_mind === "Yes" ? (
          <CheckboxInput
            label="What exactly is the product you are looking for?"
            id="technology_needed_main_system"
            options={technologyNeededValues}
            errorMsg={serverErrors?.technology_needed_main_system}
            isMulti={false}
            value={completeSystem?.technology_needed_main_system || []}
            onChange={handleCheckboxChange("technology_needed_main_system")}
          />
        ) : (
          <CheckboxInput
            label="From the following statements, which ones are true?"
            id="technology_needed"
            options={unknownTechnologyValues}
            errorMsg={serverErrors?.technology_needed}
            isMulti={false}
            value={completeSystem?.technology_needed || []}
            onChange={handleCheckboxChange("technology_needed")}
          />
        )}

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
