"use client";
import { useActionState, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { uploadSchematic } from "./actions";
import { FormErrors } from "@/types";
import { clientFileSchema } from "@/schemas/schematicRequestSchema";
import { useToast } from "@/components/ui/use-toast";
import { useContactStore } from "@/store/contact-store";
import PageHeader from "@/components/PageHeader";

import { useSchematicStore } from "@/store/schematic-store";

import FileInput from "@/components/FileInput";

const initialState: FormErrors = {};

const SchematicUploadForm = () => {
  const { contact, update } = useContactStore();
  const { schematic, update: updateSchematic } = useSchematicStore();
  const [clientErrors, setClientErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    const result = await uploadSchematic(formData);
    updateSchematic({ documentation: undefined });

    if ("success" in result) {
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const file = files[0]; // Tomamos el primer archivo por ahora
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
            errorMsg={clientErrors?.documentation}
            value={
              schematic?.documentation
                ? [
                    schematic.documentation as {
                      name: string;
                      type: string;
                      size: number;
                    },
                  ]
                : undefined
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
