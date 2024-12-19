"use client";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import Input from "@/components/Input";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import FormQuestion from "@/components/FormQuestion";
import { useSession } from "next-auth/react";
import { useAddLeadContext } from "@/contexts/addDealContext";
import { createHandleInputChange } from "@/app/forms/utils/createHandlers";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useContactStore } from "@/store/contact-store";

const initialState: FormErrors = {};

export default function StepOneFormContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const { newLeadData, updateNewLeadDetails, resetLocalStorage, dataLoaded } =
    useAddLeadContext();
  const [serverErrors, formAction] = useActionState(
    stepOneFormAction,
    initialState
  );
  const { contact } = useContactStore();
  console.log(isInitialized);
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      resetLocalStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (contact && !isInitialized && dataLoaded) {
      const contactData = {
        name: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
      };
      updateNewLeadDetails(contactData);
      setIsInitialized(true);
    }
  }, [contact, dataLoaded, isInitialized, updateNewLeadDetails]);

  const formData = {
    ...newLeadData,
    name: newLeadData.name || contact?.firstname || "",
    lastname: newLeadData.lastname || contact?.lastname || "",
    email: newLeadData.email || contact?.email || "",
  };
  const userName = session?.user?.name ?? "";
  const leadName = formData.name;

  const handleInputChange = createHandleInputChange(updateNewLeadDetails);
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
        <FormQuestion
          question={`Welcome to MBtek, my name is ${userName}. Can I have your name please?`}
        />
        <Input
          label="Name"
          id="name"
          type="text"
          errorMsg={serverErrors?.name}
          onChange={handleInputChange}
          value={formData.name || ""}
        />
        <Input
          label="Lastname"
          id="lastname"
          type="text"
          errorMsg={serverErrors?.lastname}
          onChange={handleInputChange}
          value={formData.lastname || ""}
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
          value={formData.email || ""}
        />

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
