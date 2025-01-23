"use client";

import SubmitButton from "@/components/SubmitButton";
import RadioInput from "@/components/StepForm/RadioButtonStepForm";
import { FormErrors } from "@/types";
import FormQuestion from "@/components/FormQuestion";
import { cn } from "@/lib/utils";
import { useActionState, useEffect, useState } from "react";
import { stepSixFormAction } from "./actions";
import { CompleteSystem, useSystemStore } from "@/store/completeSystem-store";
import { yesOrNoValues } from "@/schemas/completeSystemSchema";
import { Badge } from "@/components/ui/badge";
import { useContactStore } from "@/store/contact-store";
import ContactFormCard from "@/components/StepForm/ContactFormCard";
import TextAreaInput from "@/components/StepForm/TextAreaStepForm";
import { Calendar } from "lucide-react";

const initialState: FormErrors = {};

export default function StepSixForm() {
  const [dataLoaded, setIsDataLoaded] = useState(false);
  const [serverErrors, formAction] = useActionState(
    stepSixFormAction,
    initialState
  );

  useEffect(() => {
    setIsDataLoaded(true);
  }, []);
  const { completeSystem, update: updateSystem } = useSystemStore();
  const { contact } = useContactStore();

  useEffect(() => {
    if (
      contact &&
      (!completeSystem?.address ||
        !completeSystem?.city ||
        !completeSystem.zip) &&
      contact.id !== completeSystem?.id
    ) {
      updateSystem({
        ...completeSystem!,
        address: contact?.address || "",
        city: contact?.city || "",
        zip: contact?.zip || "",
        country: contact?.country || "",
        state: contact?.state || "",
        province: contact?.province || "",
        id: contact?.id || "",
      } as CompleteSystem);
    }
  }, [contact, completeSystem, updateSystem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log("name:", name, "value:", value);
    updateSystem({ ...completeSystem, [name]: value } as CompleteSystem);
  };

  const handleSelectChange = (field: string) => (value: string) => {
    updateSystem({ ...completeSystem, [field]: value } as CompleteSystem);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full p-4">
        {contact && (
          <ContactFormCard
            title={"Lead Information - Shipping information"}
            name={contact?.firstname}
            lastname={contact?.lastname}
            email={contact?.email}
            id={contact?.id}
          />
        )}
      </div>
      <form
        action={formAction}
        className={cn(
          "flex flex-1 flex-col items-center p-4",
          Object.keys(serverErrors || {}).length > 0
            ? "border-2 border-red-500 bg-red-50 rounded"
            : " bg-white  "
        )}
      >
        <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
          <FormQuestion question="Before finishing, do you  have any special requirements you would like to add to the proposal?" />
          <TextAreaInput
            label=""
            id="special_requierments"
            errorMsg={serverErrors?.special_requierments}
            onChange={handleInputChange}
            value={completeSystem?.special_requierments || ""}
            placeholder="special requirements (optional)"
          />
          <FormQuestion question="Thank you for providing all the necessary details. With this information, we can now proceed to assess and craft a tailored project proposal for you. Typically, we require one business day to prepare it. Could you please let us know when would be the most convenient time for you to review the pricing proposal with us?" />
          <a
            href="https://24467819.hs-sites.com/en/booking-calendar"
            target="_blank"
            className="inline-flex w-fit"
          >
            <Badge
              className="text-secondary text-xl flex gap-2"
              variant="success"
            >
              <Calendar />
              Booking calendar
            </Badge>
          </a>
          <FormQuestion question="During this meeting, we will go through our solutions and products for your complete setup. For this purpose, I need you to be in front of your computer. Do you have access to a computer right now? We can proceed without one, but it would be better for everyone if you can." />
          <RadioInput
            label=""
            id="prior_attempts"
            options={yesOrNoValues}
            errorMsg={serverErrors?.access_computer}
            value={completeSystem?.access_computer || ""}
            onChange={handleSelectChange("access_computer")}
          />
          <SubmitButton text="Continue" />
        </div>
      </form>
    </div>
  );
}
