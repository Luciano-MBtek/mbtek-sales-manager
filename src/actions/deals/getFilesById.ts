"use server";

export async function getFilesById(fileIds: string[]) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    // Construir la URL con los IDs de los archivos
    const idsQuery = fileIds.map((id) => `ids=${id}`).join("&");
    const url = `https://api.hubapi.com/files/v3/files/search?${idsQuery}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HubSpot API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error(
      `Failed to fetch files: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
