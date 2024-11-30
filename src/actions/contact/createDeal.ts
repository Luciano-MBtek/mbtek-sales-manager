"use server";

export async function createDeal(
  contactId: string,
  firstName: string,
  lastName: string,
  ownerId: string
): Promise<any> {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error(
        "HUBSPOT_API_KEY is not defined in the environment variables."
      );
    }

    const dealName = `Single product ${firstName} ${lastName}`;

    const dealProperties = {
      dealname: dealName,
      hubspot_owner_id: ownerId,
    };

    const associations = [
      {
        to: contactId,
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 3,
          },
        ],
      },
    ];

    const body = {
      properties: dealProperties,
      associations,
    };

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/deals`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error al crear el Deal: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const dealData = await response.json();
    const dealId = dealData.id;

    console.log("Deal creado y asociado exitosamente:", dealId);

    return dealData;
  } catch (error) {
    console.error("Error en createDeal:", error);
    throw new Error(
      `No se pudo crear el Deal: ${error instanceof Error ? error.message : "Error desconocido"}`
    );
  }
}
