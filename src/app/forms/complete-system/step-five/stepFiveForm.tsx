"use client";

import SubmitButton from "@/components/SubmitButton";
import { FormErrors } from "@/types";
import FormQuestion from "@/components/FormQuestion";
import { cn } from "@/lib/utils";
import { useActionState, useEffect, useState } from "react";
import { stepFiveFormAction } from "./actions";
import { CompleteSystem, useSystemStore } from "@/store/completeSystem-store";
import Input from "@/components/Input";
import { useContactStore } from "@/store/contact-store";
import ContactFormCard from "@/components/StepForm/ContactFormCard";
import {
  countryOptions,
  provinceOptions,
  stateOptions,
} from "../../utils/options";
import SelectInput from "@/components/StepForm/SelectStepForm";

const initialState: FormErrors = {};

export default function StepFiveForm() {
  const [dataLoaded, setIsDataLoaded] = useState(false);
  const [serverErrors, formAction] = useActionState(
    stepFiveFormAction,
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
      contact.id !== completeSystem?.id // Add this condition
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
          <FormQuestion question="For preparing a complete project proposal and calculating shipping fees, I need your complete delivery address" />
          <input
            type="hidden"
            name="id"
            readOnly
            value={completeSystem?.id || ""}
          />
          <Input
            label="Street address"
            id="address"
            type="text"
            errorMsg={serverErrors?.address}
            value={completeSystem?.address || ""}
            onChange={handleInputChange}
          />
          <Input
            label="City"
            id="city"
            type="text"
            errorMsg={serverErrors?.city}
            value={completeSystem?.city || ""}
            onChange={handleInputChange}
          />

          <Input
            label="Zip"
            id="zip"
            type="zip"
            errorMsg={serverErrors?.zip}
            value={completeSystem?.zip || ""}
            onChange={handleInputChange}
          />

          <SelectInput
            label="Country"
            id="country"
            options={countryOptions}
            placeholder="Select a country"
            errorMsg={serverErrors?.country}
            value={completeSystem?.country || ""}
            onChange={handleSelectChange("country")}
            dataLoaded={dataLoaded}
          />

          {completeSystem?.country === "USA" && (
            <SelectInput
              label="State"
              id="state"
              options={stateOptions}
              placeholder="Select a state"
              errorMsg={serverErrors?.state}
              value={completeSystem?.state || ""}
              onChange={handleSelectChange("state")}
              dataLoaded={dataLoaded}
            />
          )}

          {completeSystem?.country === "Canada" && (
            <SelectInput
              label="Province"
              id="province"
              options={provinceOptions}
              placeholder="Select a province"
              errorMsg={serverErrors?.province}
              value={completeSystem?.province || ""}
              onChange={handleSelectChange("province")}
              dataLoaded={dataLoaded}
            />
          )}

          <SubmitButton text="Continue" />
        </div>
      </form>
    </div>
  );
}
