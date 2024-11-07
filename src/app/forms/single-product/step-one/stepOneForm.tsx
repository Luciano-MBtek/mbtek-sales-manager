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
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoItem from "@/components/InfoItem";
import { MailIcon, UserIcon } from "lucide-react";
import { useEffect } from "react";

const initialState: FormErrors = {};

export default function StepSingleProductOneForm() {
  const { singleProductData, updateSingleProductDetails, dataLoaded } =
    useSingleProductContext();
  const [serverErrors, formAction] = useFormState(
    stepOneFormSingleProductAction,
    initialState
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    const paramsData = {
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
    name: singleProductData.name || searchParams.get("name") || "",
    lastname: singleProductData.lastname || searchParams.get("lastname") || "",
    email: singleProductData.email || searchParams.get("email") || "",
    country: singleProductData.country || searchParams.get("country") || "",
    state: singleProductData.state || searchParams.get("state") || "",
  };

  const handleInputChange = createHandleInputChange(updateSingleProductDetails);
  const handleSelectChange = createHandleSelectChange(
    updateSingleProductDetails
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full p-4">
        <Card className="shadow-lg w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Lead Information - Shipping information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<UserIcon className="h-5 w-5" />}
                label="Name"
                value={`${formData.name} ${formData.lastname}`}
              />
              <InfoItem
                icon={<MailIcon className="h-5 w-5" />}
                label="Email"
                value={formData.email}
              />
            </div>
          </CardContent>
        </Card>
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
