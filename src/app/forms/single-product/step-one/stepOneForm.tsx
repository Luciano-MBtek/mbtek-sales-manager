"use client";
import Input from "@/components/Input";
import { USState, canadaProvinceValues } from "@/types";
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

  useEffect(() => {
    if (contact) {
      updateSingleProductDetails({
        name: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        country: contact.country as "USA" | "Canada",
        state: contact.state as USState,
        province: contact.province as (typeof canadaProvinceValues)[number],
        address: contact.address,
        city: contact.city,
        zip: contact.zip,
        id: contact.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formData = {
    ...singleProductData,
    name: singleProductData.name || contact?.firstname || "",
    lastname: singleProductData.lastname || contact?.lastname || "",
    email: singleProductData.email || contact?.email || "",
    country: singleProductData.country || contact?.country || "",
    state: singleProductData.state || contact?.state || "",
    province: singleProductData.province || contact?.province || "",
    address: singleProductData.address || contact?.address || "",
    city: singleProductData.city || contact?.city || "",
    zip: singleProductData.zip || contact?.zip || "",
    id: singleProductData.id || contact?.id || "",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    update({ ...contact, [name]: value } as Contact);
    updateSingleProductDetails({ [name]: value });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    update({ ...contact, [field]: value } as Contact);
    updateSingleProductDetails({ [field]: value });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full p-4">
        <ContactFormCard
          title={"Lead Information - Shipping information"}
          name={formData.name}
          lastname={formData.lastname}
          email={formData.email}
          id={formData.id}
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
