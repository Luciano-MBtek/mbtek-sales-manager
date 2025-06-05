"use server";
import { createTaskSchemaType } from "@/schemas/TaskSchema";

import { revalidatePath } from "next/cache";

const API_KEY = process.env.HUBSPOT_API_KEY;

export async function createTask(taskData: createTaskSchemaType) {
  try {
    const contactId = taskData.contactId;
    delete taskData.contactId;

    const requestBody: any = {
      properties: taskData,
    };

    if (contactId) {
      requestBody.associations = [
        {
          to: contactId,

          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 204,
            },
          ],
        },
      ];
    }

    const res = await fetch(`https://api.hubapi.com/crm/v3/objects/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("HubSpot error:", errorData);
      throw new Error("HubSpot error");
    }

    revalidatePath("/tasks");
    return res.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
}
