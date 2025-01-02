"use client";
import { useActionState, useEffect } from "react";
import Input from "@/components/Input";
import {
  createHandleSelectChange,
  createHandleInputChange,
  createHandleCheckboxChange,
} from "@/app/forms/utils/createHandlers";
import {
  countryOptions,
  stateOptions,
  provinceOptions,
} from "@/app/forms/utils/options";
import SubmitButton from "@/components/SubmitButton";
import SelectInput from "@/components/StepForm/SelectStepForm";
import CheckboxInput from "@/components/StepForm/CheckboxStepForm";
import { stepTwoFormAction } from "@/app/forms/discovery-lead/step-two/actions";
import { FormErrors, leadType } from "@/types";
import { useAddLeadContext } from "@/contexts/addDealContext";
import FormQuestion from "@/components/FormQuestion";
import PhoneInputForm from "@/components/StepForm/PhoneInputForm";
import { cn } from "@/lib/utils";
import { useContactStore } from "@/store/contact-store";

const initialState: FormErrors = {};

export default function StepTwoForm() {
  const [serverErrors, formAction] = useActionState(
    stepTwoFormAction,
    initialState
  );
  const { newLeadData, updateNewLeadDetails, dataLoaded } = useAddLeadContext();
  const { contact } = useContactStore();

  useEffect(() => {
    if (contact) {
      const contactData = {
        country: contact.country || "",
        state: contact.state || "",
        province: contact.province || "",
        phone: contact.phone
          ? contact.phone.startsWith("+")
            ? contact.phone
            : `+${contact.phone}`
          : "",
      };
      updateNewLeadDetails(contactData as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formData = {
    ...newLeadData,
    name: newLeadData.country || contact?.country || "",
    lastname: newLeadData.state || contact?.state || "",
    email: newLeadData.province || contact?.province || "",
  };

  const handleInputChange = createHandleInputChange(updateNewLeadDetails);

  const handleSelectChange = createHandleSelectChange(updateNewLeadDetails);

  const handleCheckboxChange = createHandleCheckboxChange(updateNewLeadDetails);

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
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        <SelectInput
          label="Country"
          id="country"
          options={countryOptions}
          placeholder="Select a country"
          errorMsg={serverErrors?.country}
          value={formData.country || ""}
          onChange={handleSelectChange("country")}
          dataLoaded={dataLoaded}
        />

        {formData.country === "USA" && (
          <SelectInput
            label="State"
            id="state"
            options={stateOptions}
            placeholder="Select a state"
            errorMsg={serverErrors?.state}
            value={formData.state || ""}
            onChange={handleSelectChange("state")}
            dataLoaded={dataLoaded}
          />
        )}

        {formData.country === "Canada" && (
          <SelectInput
            label="Province"
            id="province"
            options={provinceOptions}
            placeholder="Select a province"
            errorMsg={serverErrors?.province}
            value={formData.province || ""}
            onChange={handleSelectChange("province")}
            dataLoaded={dataLoaded}
          />
        )}
        <PhoneInputForm
          id="phone"
          name="phone"
          errorMsg={serverErrors?.phone}
          onChange={handleInputChange}
          value={formData.phone || ""}
        />

        <FormQuestion question="Are you calling for a business of for yourself?" />
        <CheckboxInput
          label="Lead Type"
          id="leadType"
          options={leadType}
          disabledOption={"B2B (business related)"}
          errorMsg={serverErrors?.leadType}
          isMulti={false}
          value={newLeadData.leadType || ""}
          onChange={handleCheckboxChange("leadType")}
        />

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
