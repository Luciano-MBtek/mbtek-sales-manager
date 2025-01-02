"use client";

import SubmitButton from "@/components/SubmitButton";
import RadioInput from "@/components/StepForm/RadioButtonStepForm";
import { FormErrors } from "@/types";
import FormQuestion from "@/components/FormQuestion";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { stepFourFormAction } from "./actions";
import { CompleteSystem, useSystemStore } from "@/store/completeSystem-store";
import {
  installerValues,
  interestedFinanceValues,
} from "@/schemas/completeSystemSchema";

const initialState: FormErrors = {};

export default function StepFourForm() {
  const [serverErrors, formAction] = useActionState(
    stepFourFormAction,
    initialState
  );

  const { completeSystem, update } = useSystemStore();

  const handleSelectChange = (field: string) => (value: string) => {
    update({ ...completeSystem, [field]: value } as CompleteSystem);
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
        <FormQuestion question="Do you plan to complete this project by yourself or it will be done by an installer? If so, do you already have your installer?" />
        <RadioInput
          label="Who is the installer?"
          id="who_is_the_installer_"
          options={installerValues}
          errorMsg={serverErrors?.who_is_the_installer_}
          value={completeSystem?.who_is_the_installer_ || ""}
          onChange={handleSelectChange("who_is_the_installer_")}
        />
        <FormQuestion question="Are you interested to have your project financed?" />
        <p className="italic text-muted bg-success rounded-sm">
          *Helps to offer a payment alternative for someone with not enough cash
          on hand*
        </p>
        <RadioInput
          label=""
          id="interested_to_be_financed"
          options={interestedFinanceValues}
          errorMsg={serverErrors?.interested_to_be_financed}
          value={completeSystem?.interested_to_be_financed || ""}
          onChange={handleSelectChange("interested_to_be_financed")}
        />
        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
