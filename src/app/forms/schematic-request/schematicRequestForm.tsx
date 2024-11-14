"use client";
import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { uploadFile } from "./action";
import { FormErrors } from "@/types";
import TextAreaInput from "@/components/StepForm/TextAreaStepForm";
import RadioInput from "@/components/StepForm/RadioButtonStepForm";

import Input from "@/components/Input";
import { useContactStore } from "@/store/contact-store";
import PageHeader from "@/components/PageHeader";

const initialState: FormErrors = {};

const SchematicRequestForm = () => {
  const [serverErrors, formAction] = useActionState(uploadFile, initialState);
  const { contact, update } = useContactStore();

  const handleInputChange = () => {
    console.log("handle");
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Request schematic form"
        subtitle="Request a technical drawing to the team."
      />
      <form action={formAction} className="flex  flex-1 flex-col items-center">
        <div className="flex w-full flex-col gap-1 lg:max-w-[700px] p-2 ">
          <div className="flex flex-col lg:flex-row w-full gap-4 justify-between">
            <Input
              label="Firstname"
              id="firstname"
              type="text"
              errorMsg={serverErrors?.firstname}
              onChange={handleInputChange}
              value={contact?.firstname || ""}
              className="w-full"
            />
            <Input
              label="Lastname"
              id="lastname"
              type="text"
              errorMsg={serverErrors?.lastname}
              onChange={handleInputChange}
              value={contact?.lastname || ""}
              className="w-full"
            />
          </div>

          <Input
            label="Email"
            id="email"
            type="text"
            errorMsg={serverErrors?.email}
            onChange={handleInputChange}
            value={contact?.email || ""}
          />

          <Input
            label="Total's house/building area"
            id="total_area"
            type="number"
            errorMsg={serverErrors?.total_area}
            onChange={handleInputChange}
            value={""}
          />

          <Input
            label="Number of zones on the house/building"
            id="number_zones"
            type="number"
            errorMsg={serverErrors?.number_zones}
            onChange={handleInputChange}
            value={""}
          />

          <Input
            label="Square feet per zone"
            id="square_feet_zone"
            type="number"
            errorMsg={serverErrors?.square_feet_zone}
            placeholder="Bathroom: 100 sqft , Kitchen: 150 sqft ..."
            onChange={handleInputChange}
            value={""}
          />

          {/* <TextAreaInput
          id="reasonForCalling"
          label="Reason for calling us"
          maxLength={300}
          minLength={3}
          description="Why did you reach to us?"
          errorMsg={serverErrors?.reasonForCalling}
          value={newLeadData.reasonForCalling || ""}
          onChange={handleInputChange}
        /> */}

          {/*  <RadioInput
          label="Want a complete System?"
          id="wantCompleteSystem"
          options={options}
          errorMsg={serverErrors?.wantCompleteSystem}
          value={newLeadData.wantCompleteSystem || ""}
          onChange={(value) =>
            updateNewLeadDetails({ wantCompleteSystem: value })
          }
        /> */}

          <SubmitButton text="Request" />
        </div>
      </form>
    </div>
  );
};

export default SchematicRequestForm;
