"use client";
import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { createHandleInputChange } from "../../utils/createHandlers";
import { stepThreeFormAction } from "./actions";
import { FormErrors, YesOrNo } from "@/types";

import RadioInput from "@/components/StepForm/RadioButtonStepForm";
import { useAddLeadContext } from "@/contexts/addDealContext";
import Input from "@/components/Input";
import FormQuestion from "@/components/FormQuestion";
import { cn } from "@/lib/utils";

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
    <form
      action={formAction}
      className={cn(
        "flex flex-1 flex-col items-center p-2",
        Object.keys(serverErrors || {}).length > 0
          ? "border-2 border-red-500 bg-red-50 rounded"
          : " bg-white  "
      )}
    >
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]  ">
        <FormQuestion question="Can you tell me more about your project?" />

        <RadioInput
          label="Asked?"
          id="projectSummary"
          options={options}
          errorMsg={serverErrors?.projectSummary}
          value={newLeadData.projectSummary || ""}
          onChange={(value) => updateNewLeadDetails({ projectSummary: value })}
        />

        <FormQuestion question="What is the main reason you decided to give us a call today?" />

        <RadioInput
          label="Asked?"
          id="reasonForCalling"
          options={options}
          errorMsg={serverErrors?.reasonForCalling}
          value={newLeadData.reasonForCalling || ""}
          onChange={(value) =>
            updateNewLeadDetails({ reasonForCalling: value })
          }
        />

        <RadioInput
          label="Want a complete System?"
          id="wantCompleteSystem"
          options={options}
          disabledOptions={["Yes"]}
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
