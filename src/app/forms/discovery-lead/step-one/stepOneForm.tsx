"use client";
import { useActionState } from "react";
import Input from "@/components/Input";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import FormQuestion from "@/components/FormQuestion";
import { useSession } from "next-auth/react";
import { useAddLeadContext } from "@/contexts/addDealContext";
import { createHandleInputChange } from "@/app/forms/utils/createHandlers";

const initialState: FormErrors = {};

export default function StepOneForm() {
  const { data: session, status } = useSession();
  const { newLeadData, updateNewLeadDetails } = useAddLeadContext();
  const [serverErrors, formAction] = useActionState(
    stepOneFormAction,
    initialState
  );
  const userName = session?.user?.name ?? "";
  const leadName = newLeadData.name;

  const handleInputChange = createHandleInputChange(updateNewLeadDetails);
  return (
    <form action={formAction} className="flex flex-1 flex-col items-center p-4">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
        <FormQuestion
          question={`Welcome to MBtek, my name is ${userName}. Can I have your name please?`}
        />
        <Input
          label="Name"
          id="name"
          type="text"
          errorMsg={serverErrors?.name}
          onChange={handleInputChange}
          value={newLeadData.name || ""}
        />
        <Input
          label="Lastname"
          id="lastname"
          type="text"
          errorMsg={serverErrors?.lastname}
          onChange={handleInputChange}
          value={newLeadData.lastname || ""}
        />
        <FormQuestion
          question={`Hello ${leadName}, how can I help you today?`}
        />
        <FormQuestion question="First I need some general information about yourself to get this conversation started" />
        <Input
          label="Email"
          id="email"
          type="email"
          errorMsg={serverErrors?.email}
          onChange={handleInputChange}
          value={newLeadData.email || ""}
        />

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
