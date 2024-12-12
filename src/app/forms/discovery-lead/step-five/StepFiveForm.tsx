"use client";
import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { stepFiveFormAction } from "./action";
import { FormErrors, YesOrNo } from "@/types";
import { useAddLeadContext } from "@/contexts/addDealContext";

import RadioInput from "@/components/StepForm/RadioButtonStepForm";
import QualifyButton from "@/components/StepForm/QualifyButton";

const initialState: FormErrors = {};

export default function StepFourForm() {
  const [serverErrors, formAction] = useActionState(
    stepFiveFormAction,
    initialState
  );
  const { newLeadData, updateNewLeadDetails } = useAddLeadContext();

  const {
    decisionMaker,
    goodFitForLead,
    moneyAvailability,
    estimatedTimeForBuying,
  } = newLeadData;

  const disqualifyingAnswers = [
    decisionMaker,
    goodFitForLead,
    moneyAvailability,
    estimatedTimeForBuying,
  ];

  const isLeadDisqualified = disqualifyingAnswers.some(
    (answer) => answer === "No"
  );
  const isLeadQualified = disqualifyingAnswers.every(
    (answer) => answer === "Yes"
  );

  const options = YesOrNo.map((option) => option);

  const handleQualify = (value: "Yes" | "No") => {
    updateNewLeadDetails({
      decisionMaker: value,
      goodFitForLead: value,
      moneyAvailability: value,
      estimatedTimeForBuying: value,
    });
  };

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center p-4">
      {isLeadDisqualified ? (
        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-4 w-full max-w-[700px]">
          <h1 className="text-red-600 text-2xl font-bold text-center">
            Disqualified Lead
          </h1>
        </div>
      ) : isLeadQualified ? (
        <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 mb-4 w-full max-w-[700px]">
          <h1 className="text-green-600 text-2xl font-bold text-center">
            Qualified Lead
          </h1>
        </div>
      ) : (
        <div className="border-2 rounded-lg p-6 mb-4 w-full max-w-[700px]">
          <h1 className="text-2xl text-primary font-bold text-center">
            Unqualified Lead
          </h1>
        </div>
      )}
      <QualifyButton onQualify={handleQualify} />
      <div className="flex w-full flex-col gap-2 lg:max-w-[700px] ">
        <div
          className={`rounded-lg ${decisionMaker === "No" ? "border-2 border-red-500 p-1 bg-red-100" : "border-2 p-1"}`}
        >
          <RadioInput
            label="Is the contact the decision maker?"
            id="decisionMaker"
            options={options}
            errorMsg={serverErrors?.decisionMaker}
            value={decisionMaker || ""}
            onChange={(value) => updateNewLeadDetails({ decisionMaker: value })}
          />
        </div>
        <div
          className={`rounded-lg ${goodFitForLead === "No" ? "border-2 border-red-500 p-1 bg-red-100" : "border-2 p-1"}`}
        >
          <RadioInput
            label="Are we a good fit for this lead?"
            id="goodFitForLead"
            options={options}
            errorMsg={serverErrors?.goodFitForLead}
            value={goodFitForLead || ""}
            onChange={(value) =>
              updateNewLeadDetails({ goodFitForLead: value })
            }
          />
        </div>
        <div
          className={`rounded-lg ${moneyAvailability === "No" ? "border-2 border-red-500 p-1 bg-red-100" : "border-2 p-1"}`}
        >
          <RadioInput
            label="Does the lead have or can get the money?"
            id="moneyAvailability"
            options={options}
            errorMsg={serverErrors?.moneyAvailability}
            value={moneyAvailability || ""}
            onChange={(value) =>
              updateNewLeadDetails({ moneyAvailability: value })
            }
          />
        </div>
        <div
          className={`rounded-lg ${estimatedTimeForBuying === "No" ? "border-2 border-red-500 p-1 bg-red-100" : "border-2 p-1"}`}
        >
          <RadioInput
            label="Is the timing right with this lead?"
            id="estimatedTimeForBuying"
            options={options}
            errorMsg={serverErrors?.estimatedTimeForBuying}
            value={estimatedTimeForBuying || ""}
            onChange={(value) =>
              updateNewLeadDetails({ estimatedTimeForBuying: value })
            }
          />
        </div>

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
