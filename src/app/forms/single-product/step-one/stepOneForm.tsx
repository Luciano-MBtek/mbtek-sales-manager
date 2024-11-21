"use client";
import Input from "@/components/Input";
import { stepOneFormSingleProductAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import FormQuestion from "@/components/FormQuestion";
import { useSingleProductContext } from "@/contexts/singleProductContext";
import SelectInput from "@/components/StepForm/SelectStepForm";
import {
  countryOptions,
  stateOptions,
  provinceOptions,
} from "@/app/forms/utils/options";
import { useSearchParams } from "next/navigation";

import { useActionState, useEffect } from "react";
import ContactFormCard from "@/components/StepForm/ContactFormCard";
import { useContactStore, Contact } from "@/store/contact-store";

const initialState: FormErrors = {};

export default function StepSingleProductOneForm() {
  const { singleProductData, updateSingleProductDetails, dataLoaded } =
    useSingleProductContext();
  const [serverErrors, formAction] = useActionState(
    stepOneFormSingleProductAction,
    initialState
  );
  const { contact, update } = useContactStore();

  const searchParams = useSearchParams();

  useEffect(() => {
    const paramsData = {
      id: searchParams.get("id"),
      name: searchParams.get("name"),
      lastname: searchParams.get("lastname"),
      email: searchParams.get("email"),
      country: searchParams.get("country"),
      state: searchParams.get("state"),
    };

    const validParamsData = Object.fromEntries(
      Object.entries(paramsData).filter(([_, value]) => value !== null)
    );

    if (Object.keys(validParamsData).length > 0) {
      updateSingleProductDetails(validParamsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formData = {
    ...singleProductData,
    name:
      contact?.firstname ||
      singleProductData.name ||
      searchParams.get("name") ||
      "",
    lastname:
      contact?.lastname ||
      singleProductData.lastname ||
      searchParams.get("lastname") ||
      "",
    email:
      contact?.email ||
      singleProductData.email ||
      searchParams.get("email") ||
      "",
    country:
      contact?.country ||
      singleProductData.country ||
      searchParams.get("country") ||
      "",
    state:
      contact?.state ||
      singleProductData.state ||
      searchParams.get("state") ||
      "",
    province:
      contact?.province ||
      singleProductData.province ||
      searchParams.get("province") ||
      "",
    address: contact?.address || singleProductData.address || "",
    city: contact?.city || singleProductData.city || "",
    zip: contact?.zip || singleProductData.zip || "",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updateSingleProductDetails({ [id]: value });
    update({ ...contact, [id]: value } as Contact);
  };

  const handleSelectChange = (field: string) => (value: string) => {
    updateSingleProductDetails({ [field]: value });
    update({ ...contact, [field]: value } as Contact);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full p-4">
        <ContactFormCard
          title={"Lead Information - Shipping information"}
          name={formData.name}
          lastname={formData.lastname}
          email={formData.email}
        />
      </div>
      <form
        action={formAction}
        className="flex flex-1 flex-col items-center p-4 w-full"
      >
        <div className="flex w-full flex-col gap-4  ">
          <FormQuestion question="For preparing a quote and calculating shipping fees, I need your complete delivery address" />
          <Input
            label="Street address"
            id="address"
            type="text"
            errorMsg={serverErrors?.address}
            value={formData.address || ""}
            onChange={handleInputChange}
          />
          <Input
            label="City"
            id="city"
            type="text"
            errorMsg={serverErrors?.city}
            value={formData.city || ""}
            onChange={handleInputChange}
          />

          <Input
            label="Zip"
            id="zip"
            type="zip"
            errorMsg={serverErrors?.zip}
            value={formData.zip || ""}
            onChange={handleInputChange}
          />

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

          <SubmitButton text="Continue" />
        </div>
      </form>
    </div>
  );
}
