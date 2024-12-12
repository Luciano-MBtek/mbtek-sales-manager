"use client";
import { useActionState } from "react";
import SelectInput from "@/components/StepForm/SelectStepForm";
import SubmitButton from "@/components/SubmitButton";
import { stepFourFormAction } from "./action";
import { FormErrors, LeadBuyingIntention } from "@/types";
import { DatePickerForm } from "@/components/StepForm/DatePickerStepForm";
import { useAddLeadContext } from "@/contexts/addDealContext";
import FormQuestion from "@/components/FormQuestion";
import {
  createHandleDateChange,
  createHandleSelectChange,
  getDateValue,
} from "@/app/forms/utils/createHandlers";
import { cn } from "@/lib/utils";

const buyingIntentionOptions = LeadBuyingIntention.map((option) => ({
  label: option,
  value: option,
}));

const initialState: FormErrors = {};

export default function StepFourForm() {
  const [serverErrors, formAction] = useActionState(
    stepFourFormAction,
    initialState
  );
  const { newLeadData, updateNewLeadDetails, dataLoaded } = useAddLeadContext();

  const handleSelectChange = createHandleSelectChange(updateNewLeadDetails);

  const handleDateChange = createHandleDateChange(updateNewLeadDetails);

  const name = newLeadData.name;
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
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
        <FormQuestion question="At what stage are you in your project?" />
        <SelectInput
          label="Lead buying intention"
          id="leadBuyingIntention"
          options={buyingIntentionOptions}
          placeholder="Select buying intention"
          errorMsg={serverErrors?.leadBuyingIntention}
          value={newLeadData.leadBuyingIntention || ""}
          onChange={handleSelectChange("leadBuyingIntention")}
          dataLoaded={dataLoaded}
        />
        <FormQuestion question="When do you plan to start your project?" />
        <DatePickerForm
          label="Expected ETA"
          id="expectedETA"
          value={getDateValue(newLeadData, "expectedETA")}
          onChange={handleDateChange("expectedETA")}
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
