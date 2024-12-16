"use client";
import { useActionState } from "react";
import Input from "@/components/Input";
import SubmitButton from "../../../../components/SubmitButton";
import { stepThreeFormAction } from "./action";
import { FormErrors } from "@/types";

const initialState: FormErrors = {};

export default function StepThreeFormB2B() {
  const [serverErrors, formAction] = useActionState(
    stepThreeFormAction,
    initialState
  );
  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
