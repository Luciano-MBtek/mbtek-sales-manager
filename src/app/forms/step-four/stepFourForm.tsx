"use client";
import SelectInput from "@/components/SelectStepForm";
import SubmitButton from "../../../components/SubmitButton";
import { stepFourFormAction } from "./action";
import { FormErrors, LeadBuyingIntention } from "@/types";
import { useFormState } from "react-dom";
import { DatePickerForm } from "@/components/DatePickerStepForm";

const buyingIntentionOptions = LeadBuyingIntention.map((option) => ({
  label: option,
  value: option,
}));

const initialState: FormErrors = {};

export default function StepFourForm() {
  const [serverErrors, formAction] = useFormState(
    stepFourFormAction,
    initialState
  );
  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
        <SelectInput
          label="Lead buying intention"
          id="leadBuyingIntention"
          options={buyingIntentionOptions}
          placeholder="Select buying intention"
          errorMsg={serverErrors?.leadBuyingIntention}
        />
        <DatePickerForm
          label="Expected ETA"
          id="expectedETA"
          errorMsg={serverErrors?.expectedETA}
        />
        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
