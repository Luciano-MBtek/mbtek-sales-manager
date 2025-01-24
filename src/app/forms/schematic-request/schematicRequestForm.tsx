"use client";
import { useActionState, useEffect, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { uploadFile } from "./action";
import { FormErrors } from "@/types";
import {
  clientFileSchema,
  heatElementValues,
  specialApplicationValues,
} from "@/schemas/schematicRequestSchema";
import CheckboxInput from "@/components/StepForm/CheckboxStepForm";

import Input from "@/components/Input";
import { Contact, useContactStore } from "@/store/contact-store";
import PageHeader from "@/components/PageHeader";

import { useSchematicStore } from "@/store/schematic-store";
import SelectInput from "@/components/StepForm/SelectStepForm";
import TextAreaInput from "@/components/StepForm/TextAreaStepForm";
import FileInput from "@/components/FileInput";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export type ActionState = {
  success?: boolean;
  errors?: FormErrors;
  errorMsg?: string;
};

const initialState: {
  success?: boolean;
  errors?: FormErrors;
  errorMsg?: string;
} = {};

const SchematicRequestForm = () => {
  const [serverResponse, formAction, pending] = useActionState<
    ActionState,
    FormData
  >(uploadFile, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const { contact, update } = useContactStore();
  const { schematic, update: updateSchematic, clear } = useSchematicStore();
  const [clientErrors, setClientErrors] = useState<FormErrors>({});
  const handleCheckboxChange =
    (fieldId: string) => (value: string | string[]) => {
      updateSchematic({ [fieldId]: Array.isArray(value) ? value : [value] });
    };

  useEffect(() => {
    if (serverResponse?.success) {
      toast({
        title: "Success",
        description: "Schematic request submitted successfully",
      });
      clear();
      router.push(`/contacts/${contact?.id}/schematic`);
    } else if (serverResponse?.errorMsg) {
      toast({
        title: "Error",
        description: serverResponse.errorMsg,
        variant: "destructive",
      });
    }
  }, [serverResponse, toast, clear, router, contact]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const contactFields = ["firstname", "lastname", "email", "zip"];

    if (contactFields.includes(name)) {
      update({ ...contact, [name]: value } as Contact);
    } else {
      updateSchematic({ [name]: value });
    }
  };

  const handleSelectChange = (fieldId: string) => (value: string) => {
    updateSchematic({ [fieldId]: value });
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
      };

      const validatedFile = clientFileSchema.parse(fileData);

      useSchematicStore.getState().update({
        documentation: {
          ...validatedFile,
        },
      });
      setClientErrors((prev) => ({ ...prev, documentation: undefined }));
    } catch (error) {
      console.log(error);
      const zodError = error as { issues?: { message: string }[] };
      const errorMessage =
        zodError.issues?.[0]?.message ||
        "Invalid file. Please check the file requirements.";
      setClientErrors((prev) => ({
        ...prev,
        documentation: errorMessage,
      }));
    }
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
              errorMsg={serverResponse.errors?.firstname}
              onChange={handleInputChange}
              value={contact?.firstname || ""}
              className="w-full"
            />
            <Input
              label="Lastname"
              id="lastname"
              type="text"
              errorMsg={serverResponse.errors?.lastname}
              onChange={handleInputChange}
              value={contact?.lastname || ""}
              className="w-full"
            />
          </div>
          <input
            type="hidden"
            id="id"
            name="id"
            value={contact?.id || ""}
            readOnly
          />

          <Input
            label="Email"
            id="email"
            type="text"
            errorMsg={serverResponse.errors?.email}
            onChange={handleInputChange}
            value={contact?.email || ""}
          />

          <Input
            label="Zip"
            id="zip"
            type="text"
            errorMsg={serverResponse.errors?.zip}
            onChange={handleInputChange}
            value={contact?.zip || ""}
          />

          <Input
            label="Total's house/building area"
            id="total_area"
            type="number"
            errorMsg={serverResponse.errors?.total_area}
            onChange={handleInputChange}
            value={schematic?.total_area || ""}
          />

          <Input
            label="Number of zones on the house/building"
            id="number_zones"
            type="number"
            errorMsg={serverResponse.errors?.number_zones}
            onChange={handleInputChange}
            value={schematic?.number_zones || ""}
          />

          <Input
            label="Square feet per zone"
            id="square_feet_zone"
            type="text"
            errorMsg={serverResponse.errors?.square_feet_zone}
            placeholder="Bathroom: 100 sqft , Kitchen: 150 sqft ..."
            onChange={handleInputChange}
            value={schematic?.square_feet_zone || ""}
          />

          <CheckboxInput
            label="Heat elements"
            id="heat_elements"
            options={heatElementValues}
            errorMsg={serverResponse.errors?.heat_elements}
            isMulti={true}
            value={schematic?.heat_elements || []}
            onChange={handleCheckboxChange("heat_elements")}
            dataLoaded={true}
            uppercase={true}
          />

          <SelectInput
            label="Special application"
            id="special_application"
            options={specialApplicationValues}
            placeholder="Select an special application"
            errorMsg={serverResponse.errors?.special_application}
            value={schematic?.special_application || ""}
            onChange={handleSelectChange("special_application")}
            dataLoaded={contact ? true : false}
          />

          <FileInput
            label="Technical documentation received from the prospect"
            id="documentation"
            errorMsg={
              clientErrors?.documentation ||
              serverResponse.errors?.documentation
            }
            value={
              schematic?.documentation as
                | { name: string; type: string; size: number }
                | undefined
            }
            onChange={handleFileUpload}
          />

          <TextAreaInput
            label="Any extra note for the technical drawer"
            placeholder="Extra notes..."
            id="extra_notes"
            value={schematic?.extra_notes || ""}
            errorMsg={serverResponse.errors?.extra_notes}
            onChange={handleInputChange}
            maxLength={300}
          />

          <SubmitButton text="Request" disabled={pending} />
        </div>
      </form>
    </div>
  );
};

export default SchematicRequestForm;
