"use client";
import SelectInput from "@/components/SelectStepForm";
import SubmitButton from "../../../components/SubmitButton";
import { stepFourFormAction } from "./action";
import { FormErrors, LeadBuyingIntention } from "@/types";
import { useFormState } from "react-dom";
import { DatePickerForm } from "@/components/DatePickerStepForm";
import { useAddLeadContext } from "@/contexts/addDealContext";
import { MessageCircleMore } from "lucide-react";
import FormQuestion from "@/components/FormQuestion";

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
  const { newLeadData } = useAddLeadContext();

  const name = newLeadData.name;
  return (
    <form action={formAction} className="flex flex-1 flex-col items-center p-4">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
        <FormQuestion question="At what stage are you in your project?" />
        <SelectInput
          label="Lead buying intention"
          id="leadBuyingIntention"
          options={buyingIntentionOptions}
          placeholder="Select buying intention"
          errorMsg={serverErrors?.leadBuyingIntention}
        />
        <FormQuestion question="When do you plan to start your project?" />
        <DatePickerForm
          label="Expected ETA"
          id="expectedETA"
          errorMsg={serverErrors?.expectedETA}
        />
        <FormQuestion
          question={`Thank you very much for this ${name}. I have everything needed for the first part of this conversation. Please allow me a moment to add this in the system.`}
        />

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
