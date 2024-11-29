"use client";
import { useActionState } from "react";
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

const initialState: FormErrors = {};

export default function StepTwoForm() {
  const [serverErrors, formAction] = useActionState(
    stepTwoFormAction,
    initialState
  );
  const { newLeadData, updateNewLeadDetails, dataLoaded } = useAddLeadContext();

  console.log(newLeadData);

  const handleInputChange = createHandleInputChange(updateNewLeadDetails);

  const handleSelectChange = createHandleSelectChange(updateNewLeadDetails);

  const handleCheckboxChange = createHandleCheckboxChange(updateNewLeadDetails);

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center p-4">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* <Input
          label="Phone Number"
          id="phone"
          type="tel"
          description="Please enter a valid phone number (10 digits)"
          placeholder="123-456-7890"
          errorMsg={serverErrors?.phone}
          onChange={handleInputChange}
          value={newLeadData.phone || ""}
        /> */}
        <SelectInput
          label="Country"
          id="country"
          options={countryOptions}
          placeholder="Select a country"
          errorMsg={serverErrors?.country}
          value={newLeadData.country || ""}
          onChange={handleSelectChange("country")}
          dataLoaded={dataLoaded}
        />
        <PhoneInputForm
          id="phone"
          name="phone"
          errorMsg={serverErrors?.phone}
          onChange={handleInputChange}
          value={newLeadData.phone || ""}
        />

        {newLeadData.country === "USA" && (
          <SelectInput
            label="State"
            id="state"
            options={stateOptions}
            placeholder="Select a state"
            errorMsg={serverErrors?.state}
            value={newLeadData.state || ""}
            onChange={handleSelectChange("state")}
            dataLoaded={dataLoaded}
          />
        )}

        {newLeadData.country === "Canada" && (
          <SelectInput
            label="Province"
            id="province"
            options={provinceOptions}
            placeholder="Select a province"
            errorMsg={serverErrors?.province}
            value={newLeadData.province || ""}
            onChange={handleSelectChange("province")}
            dataLoaded={dataLoaded}
          />
        )}

        <FormQuestion question="Are you calling for a business of for yourself?" />
        <CheckboxInput
          label="Lead Type"
          id="leadType"
          options={leadType}
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
