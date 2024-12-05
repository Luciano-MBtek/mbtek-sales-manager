"use client";
import { useActionState, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { uploadFile } from "./action";
import { FormErrors } from "@/types";
import {
  heatElementValues,
  schematicRequestSchema,
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

const initialState: FormErrors = {};

const SchematicRequestForm = () => {
  const [serverErrors, formAction] = useActionState(uploadFile, initialState);
  const { contact, update } = useContactStore();
  const { schematic, update: updateSchematic } = useSchematicStore();
  const [clientErrors, setClientErrors] = useState<FormErrors>({});
  const handleCheckboxChange =
    (fieldId: string) => (value: string | string[]) => {
      updateSchematic({ [fieldId]: Array.isArray(value) ? value : [value] });
    };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const contactFields = ["firstname", "lastname", "email"];

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
      // Convertir el File a Buffer
      const buffer = await file.arrayBuffer().then(Buffer.from);

      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        buffer: buffer,
      };

      // Validar solo el archivo usando el fileSchema
      const validatedFile =
        schematicRequestSchema.shape.documentation.parse(fileData);

      // Si la validación es exitosa, actualizar el store
      useSchematicStore.getState().update({
        documentation: validatedFile,
      });
      setClientErrors((prev) => ({ ...prev, documentation: undefined }));
    } catch (error) {
      // Manejar el error de validación
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
            label="Zip"
            id="zip"
            type="text"
            errorMsg={serverErrors?.zip}
            onChange={handleInputChange}
            value={contact?.zip || ""}
          />

          <Input
            label="Total's house/building area"
            id="total_area"
            type="number"
            errorMsg={serverErrors?.total_area}
            onChange={handleInputChange}
            value={schematic?.total_area || ""}
          />

          <Input
            label="Number of zones on the house/building"
            id="number_zones"
            type="number"
            errorMsg={serverErrors?.number_zones}
            onChange={handleInputChange}
            value={schematic?.number_zones || ""}
          />

          <Input
            label="Square feet per zone"
            id="square_feet_zone"
            type="text"
            errorMsg={serverErrors?.square_feet_zone}
            placeholder="Bathroom: 100 sqft , Kitchen: 150 sqft ..."
            onChange={handleInputChange}
            value={schematic?.square_feet_zone || ""}
          />

          <CheckboxInput
            label="Heat elements"
            id="heat_elements"
            options={heatElementValues}
            errorMsg={serverErrors?.heat_elements}
            isMulti={true}
            value={schematic?.heat_elements || []}
            onChange={handleCheckboxChange("heat_elements")}
          />

          <SelectInput
            label="Special application"
            id="special_application"
            options={specialApplicationValues}
            placeholder="Select an special application"
            errorMsg={serverErrors?.special_application}
            value={schematic?.special_application || ""}
            onChange={handleSelectChange("special_application")}
            dataLoaded={contact ? true : false}
          />

          <FileInput
            label="Technical documentation received from the prospect"
            id="documentation"
            errorMsg={
              clientErrors?.documentation || serverErrors?.documentation
            }
            value={
              schematic?.documentation as
                | { name: string; type: string; size: number; buffer: Buffer }
                | undefined
            }
            onChange={handleFileUpload}
          />

          <TextAreaInput
            label="Any extra note for the technical drawer"
            placeholder="Extra notes..."
            id="extra_notes"
            value={schematic?.extra_notes || ""}
            errorMsg={serverErrors?.extra_notes}
            onChange={handleInputChange}
            maxLength={300}
          />

          <SubmitButton text="Request" />
        </div>
      </form>
    </div>
  );
};

export default SchematicRequestForm;
