"use client";
import Input from "@/components/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SubmitButton from "../../../components/SubmitButton";
import { stepThreeFormAction } from "./actions";
import { FormErrors } from "@/types";
import { useFormState } from "react-dom";
import TextAreaInput from "@/components/TextAreaStepForm";

const initialState: FormErrors = {};

export default function StepThreeForm() {
  const [serverErrors, formAction] = useFormState(
    stepThreeFormAction,
    initialState
  );
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
          required
          description="Why did you reach to us?"
          errorMsg={serverErrors?.reasonForCalling}
        />

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
