"use server";
import { createFileHubspot } from "@/actions/createFileHS";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { completeSystemDocumentationSchema } from "@/schemas/completeSystemSchema";
import { CompleteSystemDocumentationData, FormErrors } from "@/types";

const folderId =
  process.env.COMPLETE_SYSTEM_DOCUMENTATION_UPLOADS || "191129824845";

export const uploadCompleteSystemDocumentation = async (
  formData: FormData
): Promise<
  | {
      success: boolean;
      message: string;
      newFiles: { id: string; name: string; url: string }[];
    }
  | FormErrors
> => {
  try {
    const data = {} as CompleteSystemDocumentationData;

    const dealId = formData.get("dealId") as string;
    if (!dealId) {
      return {
        success: false,
        message: "Deal ID is required",
        newFiles: [],
      };
    }
    data.id = dealId;

    const files = formData.getAll("documentation") as File[];
    const existingFileIds = formData.get("existingFileIds") as string;
    const existingIdsArray = existingFileIds ? existingFileIds.split(";") : [];

    if (files.length === 0 && existingIdsArray.length > 0) {
      const hubspotProperties = {
        complete_system_documentation: existingIdsArray.join(";"),
      };
      await patchDealProperties(dealId, hubspotProperties);
      return {
        success: true,
        message: "Documentation updated successfully with existing files",
        newFiles: [],
      };
    }

    if (files.length > 0) {
      const documentationFiles = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            buffer: Buffer.from(buffer),
          };
        })
      );
      data.documentation = documentationFiles;
    }

    const validated = completeSystemDocumentationSchema.safeParse(
      data.documentation
    );

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
    if (!documentation) {
      return {
        success: false,
        message: "No files were provided",
        newFiles: [],
      };
    }

    const documentationFiles = await Promise.all(
      documentation.map((doc) =>
        createFileHubspot({
          documentation: doc,
          folderId: folderId as string,
        })
      )
    );
    const documentationFileIds = documentationFiles.map((file) => file.id);

    const allFileIds = [
      ...new Set([...documentationFileIds, ...existingIdsArray]),
    ];

    const hubspotProperties = {
      complete_system_documentation: allFileIds.join(";"),
    };

    await patchDealProperties(data.id, hubspotProperties);

    return {
      success: true,
      message: "Complete system documentation uploaded successfully",
      newFiles: documentationFiles.map((file) => ({
        id: file.id,
        name: file.name,
        url: file.url,
      })),
    };
  } catch (error) {
    console.error("Error in uploadCompleteSystemDocumentation:", error);
    return {
      success: false,
      message: "Error uploading files",
      newFiles: [],
    };
  }
};
