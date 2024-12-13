"use server";
import { createFileHubspot } from "@/actions/createFileHS";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { clientFileSchema } from "@/schemas/schematicRequestSchema";
import { FormErrors, mainRoutes, SchematicRequestData } from "@/types";
import { redirect } from "next/navigation";

const folderId = process.env.SCHEMATIC_UPLOADS;

export const uploadSchematic = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const data = {} as SchematicRequestData;

  const id = formData.get("id") as string;
  data.id = id;

  const file = formData.get("documentation") as File | null;
  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    data.documentation = {
      name: file.name,
      type: file.type,
      size: file.size,
      buffer: Buffer.from(buffer),
    };
  }

  const validated = clientFileSchema.safeParse(data.documentation);

  if (!validated.success) {
    console.log("Validation:", validated.error);
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  const documentation = data.documentation;
  if (documentation) {
    try {
      const schematicFile = await createFileHubspot({
        documentation,
        folderId: folderId as string,
      });
      const schematicFileUrl = schematicFile.url;

      const hubspotProperties = {
        schematic_image: schematicFileUrl,
      };

      console.log("hubspot Properties:", hubspotProperties);

      const contactUpdate = await patchContactProperties(
        data.id,
        hubspotProperties
      );

      console.log("Contact update:", contactUpdate);
    } catch (error) {
      console.log(error);

      return { documentation: "Error uploading the file" };
    }
  }

  // redirect(mainRoutes.CONTACTS);
};
