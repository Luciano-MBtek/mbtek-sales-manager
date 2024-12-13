"use client";
import { useActionState, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { uploadSchematic } from "./actions";
import { FormErrors } from "@/types";
import { clientFileSchema } from "@/schemas/schematicRequestSchema";

import { useContactStore } from "@/store/contact-store";
import PageHeader from "@/components/PageHeader";

import { useSchematicStore } from "@/store/schematic-store";

import FileInput from "@/components/FileInput";

const initialState: FormErrors = {};

const SchematicUploadForm = () => {
  const [serverErrors, formAction] = useActionState(
    uploadSchematic,
    initialState
  );
  const { contact, update } = useContactStore();
  const { schematic, update: updateSchematic } = useSchematicStore();
  const [clientErrors, setClientErrors] = useState<FormErrors>({});

  const handleSubmit = async (formData: FormData) => {
    formAction(formData);
    updateSchematic({ documentation: undefined });
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
        title="Schematic upload."
        subtitle="Attach technical drawing to contact."
      />
      <form
        action={handleSubmit}
        className="flex  flex-1 flex-col items-center"
      >
        <div className="flex w-full flex-col gap-1 lg:max-w-[700px] p-2 ">
          <input
            type="hidden"
            id="id"
            name="id"
            value={contact?.id || ""}
            readOnly
          />

          <FileInput
            label="Technical documentation received from the prospect"
            id="documentation"
            errorMsg={
              clientErrors?.documentation || serverErrors?.documentation
            }
            value={
              schematic?.documentation as
                | { name: string; type: string; size: number }
                | undefined
            }
            onChange={handleFileUpload}
          />

          <SubmitButton text="Upload" />
        </div>
      </form>
    </div>
  );
};

export default SchematicUploadForm;
