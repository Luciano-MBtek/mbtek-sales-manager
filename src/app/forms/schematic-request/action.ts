"use server";
import { createFileHubspot } from "@/actions/createFileHS";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { schematicRequestSchema } from "@/schemas/schematicRequestSchema";
import {
  FormErrors,
  mainRoutes,
  SchematicRequestData,
  StringFields,
} from "@/types";
import { redirect } from "next/navigation";

const folderId = process.env.SCHEMATIC_REQUEST;

export const uploadFile = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const textFields: StringFields[] = [
    "id",
    "firstname",
    "lastname",
    "email",
    "zip",
    "total_area",
    "number_zones",
    "square_feet_zone",
    "special_application",
    "extra_notes",
  ];
  const data = {} as SchematicRequestData;
  for (const field of textFields) {
    const value = formData.get(field);
    data[field as StringFields] = value as string;
  }

  data.heat_elements = formData
    .getAll("heat_elements")
    .map((value) => String(value));

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

  const validated = schematicRequestSchema.safeParse(data);

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
        zip: data.zip,
        total_area_house: data.total_area,
        number_of_zones: data.number_zones,
        square_feet_per_zone: data.square_feet_zone,
        heat_elements: data.heat_elements.join(";"),
        special_application: data.special_application,
        extra_notes: data.extra_notes,
        technical_documention_received_from_the_prospect: schematicFileUrl,
      };

      console.log("hubspot Properties:", hubspotProperties);

      const contactUpdate = await patchContactProperties(
        data.id,
        hubspotProperties
      );
      const webhookResponse = await fetch(
        "https://api-na1.hubapi.com/automation/v4/webhook-triggers/24467819/cI0fLqr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contactId: data.id,
          }),
        }
      );

      if (!webhookResponse.ok) {
        console.error(
          "Error triggering webhook:",
          await webhookResponse.text()
        );
      }

      console.log("Contact update:", contactUpdate);
    } catch (error) {
      console.log(error);

      return { documentation: "Error uploading the file" };
    }
  }

  // redirect(mainRoutes.CONTACTS);
};
