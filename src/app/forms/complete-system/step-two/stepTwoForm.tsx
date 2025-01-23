"use client";

import SubmitButton from "@/components/SubmitButton";
import RadioInput from "@/components/StepForm/RadioButtonStepForm";
import CheckboxInput from "@/components/StepForm/CheckboxStepForm";
import { FormErrors } from "@/types";
import FormQuestion from "@/components/FormQuestion";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { stepTwoFormAction } from "./actions";
import { CompleteSystem, useSystemStore } from "@/store/completeSystem-store";
import {
  prospectValuedBenefitsValues,
  yesOrNoValues,
  competitorsValues,
} from "@/schemas/completeSystemSchema";
import Input from "@/components/Input";
import TextAreaInput from "@/components/StepForm/TextAreaStepForm";

const initialState: FormErrors = {};

export default function StepTwoForm() {
  const [serverErrors, formAction] = useActionState(
    stepTwoFormAction,
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
        <FormQuestion question="Between the next options, which one is THE most important benefit for you?" />
        <CheckboxInput
          label=""
          id="prospect_valued_benefits"
          options={prospectValuedBenefitsValues}
          errorMsg={serverErrors?.prospect_valued_benefits}
          isMulti={false}
          value={completeSystem?.prospect_valued_benefits || []}
          onChange={handleCheckboxChange("prospect_valued_benefits")}
        />
        {completeSystem?.prospect_valued_benefits?.includes("Other") && (
          <Input
            label="Other prospect valued benefits:"
            id="other_prospect_valued_benefits"
            type="text"
            errorMsg={serverErrors?.other_prospect_valued_benefits}
            onChange={handleInputChange}
            value={completeSystem?.other_prospect_valued_benefits || ""}
            className="w-full"
          />
        )}
        <FormQuestion question="Before reaching out to us, have you already attempted any solutions or consulted with another company about your new heating/cooling system?" />
        <RadioInput
          label=""
          id="prior_attempts"
          options={yesOrNoValues}
          errorMsg={serverErrors?.prior_attempts}
          value={completeSystem?.prior_attempts || ""}
          onChange={handleSelectChange("prior_attempts")}
        />
        {completeSystem?.prior_attempts === "Yes" && (
          <>
            <TextAreaInput
              label="How you addressed it?, and why are you seeking this solution now?"
              id="confirmed_prior_attempt"
              errorMsg={serverErrors?.confirmed_prior_attempt}
              onChange={handleInputChange}
              value={completeSystem?.confirmed_prior_attempt || ""}
            />
            <CheckboxInput
              label="Who you previously contacted for your project?"
              id="competitors_previously_contacted"
              options={competitorsValues}
              errorMsg={serverErrors?.competitors_previously_contacted}
              isMulti={false}
              value={completeSystem?.competitors_previously_contacted || []}
              onChange={handleCheckboxChange(
                "competitors_previously_contacted"
              )}
            />
            <TextAreaInput
              label="How it went?"
              id="competitors_feedback"
              errorMsg={serverErrors?.competitors_feedback}
              onChange={handleInputChange}
              value={completeSystem?.competitors_feedback || ""}
            />
          </>
        )}

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
