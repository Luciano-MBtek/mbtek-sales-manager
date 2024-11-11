"use client";
import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import {
  createHandleInputChange,
  createHandleRadioChange,
} from "../../utils/createHandlers";
import { stepThreeFormAction } from "./actions";
import { FormErrors, YesOrNo } from "@/types";
import TextAreaInput from "@/components/StepForm/TextAreaStepForm";
import RadioInput from "@/components/StepForm/RadioButtonStepForm";
import { useAddLeadContext } from "@/contexts/addDealContext";
import Input from "@/components/Input";

const initialState: FormErrors = {};

const options = YesOrNo.map((option) => option);

export default function StepThreeForm() {
  const [serverErrors, formAction] = useActionState(
    stepThreeFormAction,
    initialState
  );

  const { newLeadData, updateNewLeadDetails } = useAddLeadContext();

  const handleInputChange = createHandleInputChange(updateNewLeadDetails);

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
        <TextAreaInput
          id="projectSummary"
          label="Project Summary"
          maxLength={300}
          minLength={5}
          description="Little summary of the project"
          errorMsg={serverErrors?.projectSummary}
          value={newLeadData.projectSummary || ""}
          onChange={handleInputChange}
        />

        <TextAreaInput
          id="reasonForCalling"
          label="Reason for calling us"
          maxLength={300}
          minLength={3}
          description="Why did you reach to us?"
          errorMsg={serverErrors?.reasonForCalling}
          value={newLeadData.reasonForCalling || ""}
          onChange={handleInputChange}
        />

        <RadioInput
          label="Want a complete System?"
          id="wantCompleteSystem"
          options={options}
          errorMsg={serverErrors?.wantCompleteSystem}
          value={newLeadData.wantCompleteSystem || ""}
          onChange={(value) =>
            updateNewLeadDetails({ wantCompleteSystem: value })
          }
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
              onChange={handleInputChange}
              value={newLeadData.allocatedBudget || ""}
            />

            <Input
              label="Steps for making a decision"
              id="stepsForDecision"
              type="text"
              description="Is there extra steps need to be taken for a decision?"
              placeholder="Yes/No: ..."
              errorMsg={serverErrors?.stepsForDecision}
              onChange={handleInputChange}
              value={newLeadData.stepsForDecision || ""}
            />
          </>
        )}

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
