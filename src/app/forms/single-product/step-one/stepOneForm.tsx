"use client";
import Input from "@/components/Input";
import { useFormState } from "react-dom";
import {
  createHandleSelectChange,
  createHandleInputChange,
} from "@/app/forms/utils/createHandlers";
import { stepOneFormSingleProductAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import FormQuestion from "@/components/FormQuestion";
import { useSingleProductContext } from "@/contexts/singleProductContext";
import SelectInput from "@/components/SelectStepForm";
import {
  countryOptions,
  stateOptions,
  provinceOptions,
} from "@/app/forms/utils/options";

const initialState: FormErrors = {};

export default function StepSingleProductOneForm() {
  const { singleProductData, updateSingleProductDetails, dataLoaded } =
    useSingleProductContext();
  const [serverErrors, formAction] = useFormState(
    stepOneFormSingleProductAction,
    initialState
  );

  const handleInputChange = createHandleInputChange(updateSingleProductDetails);
  const handleSelectChange = createHandleSelectChange(
    updateSingleProductDetails
  );

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center p-4">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
        <FormQuestion question="For preparing a quote and calculating shipping fees, I need your complete delivery address" />
        <Input
          label="Street address"
          id="address"
          type="text"
          errorMsg={serverErrors?.address}
          value={singleProductData.address || ""}
          onChange={handleInputChange}
        />
        <Input
          label="City"
          id="city"
          type="text"
          errorMsg={serverErrors?.city}
          value={singleProductData.city || ""}
          onChange={handleInputChange}
        />

        <Input
          label="Zip"
          id="zip"
          type="zip"
          errorMsg={serverErrors?.zip}
          value={singleProductData.zip || ""}
          onChange={handleInputChange}
        />

        <SelectInput
          label="Country"
          id="country"
          options={countryOptions}
          placeholder="Select a country"
          errorMsg={serverErrors?.country}
          value={singleProductData.country || ""}
          onChange={handleSelectChange("country")}
          dataLoaded={dataLoaded}
        />

        {singleProductData.country === "USA" && (
          <SelectInput
            label="State"
            id="state"
            options={stateOptions}
            placeholder="Select a state"
            errorMsg={serverErrors?.state}
            value={singleProductData.state || ""}
            onChange={handleSelectChange("state")}
            dataLoaded={dataLoaded}
          />
        )}

        {singleProductData.country === "Canada" && (
          <SelectInput
            label="Province"
            id="province"
            options={provinceOptions}
            placeholder="Select a province"
            errorMsg={serverErrors?.province}
            value={singleProductData.province || ""}
            onChange={handleSelectChange("province")}
            dataLoaded={dataLoaded}
          />
        )}

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
