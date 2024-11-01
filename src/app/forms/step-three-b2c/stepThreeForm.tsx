"use client";
import SubmitButton from "../../../components/SubmitButton";
import { stepThreeFormAction } from "./actions";
import { FormErrors, YesOrNo } from "@/types";
import { useFormState } from "react-dom";
import TextAreaInput from "@/components/TextAreaStepForm";
import RadioInput from "@/components/RadioButtonStepForm";
import { useAddLeadContext } from "@/contexts/addDealContext";
import Input from "@/components/Input";

const initialState: FormErrors = {};

const options = YesOrNo.map((option) => option);

export default function StepThreeForm() {
  const [serverErrors, formAction] = useFormState(
    stepThreeFormAction,
    initialState
  );

  const { newLeadData } = useAddLeadContext();
  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
        <TextAreaInput
          id="projectSummary"
          label="Project Summary"
          required
          maxLength={300}
          minLength={5}
          description="Little summary of the project"
          errorMsg={serverErrors?.projectSummary}
        />

        <TextAreaInput
          id="reasonForCalling"
          label="Reason for calling us"
          maxLength={300}
          minLength={3}
          required
          description="Why did you reach to us?"
          errorMsg={serverErrors?.reasonForCalling}
        />

        <RadioInput
          label="Want a complete System?"
          id="wantCompleteSystem"
          options={options}
          errorMsg={serverErrors?.wantCompleteSystem}
        />

        {newLeadData.wantCompleteSystem === "Yes" && (
          <>
            <Input
              label="Allocated Budget"
              id="allocatedBudget"
              type="text"
              description="What budget have you planned to achieve your project?"
              placeholder="$2000"
              errorMsg={serverErrors?.allocatedBudget}
            />

            <Input
              label="Steps for making a decision"
              id="stepsForDecision"
              type="text"
              description="Is there extra steps need to be taken for a decision?"
              placeholder="Yes/No: ..."
              errorMsg={serverErrors?.stepsForDecision}
            />
          </>
        )}

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
