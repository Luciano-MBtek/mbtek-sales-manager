"use server";

import { DocumentationFile } from "@/types";

interface createFileProps {
  documentation: DocumentationFile;
  folderId: string;
}

export async function createFileHubspot({
  documentation,
  folderId,
}: createFileProps) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const options = {
      access: "PUBLIC_INDEXABLE",
      overwrite: true,
    };

    const formData = new FormData();
    formData.append("folderId", folderId);
    formData.append("options", JSON.stringify(options));

    const fileBlob = new Blob([documentation.buffer], {
      type: documentation.type,
    });

    formData.append("file", fileBlob, documentation.name);

    const response = await fetch("https://api.hubapi.com/files/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HubSpot error details:", errorText);
      throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file to HubSpot:", error);
    throw error;
  }
}
