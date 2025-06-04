"use server";
import { TaskStatus } from "@/types/Tasks";

import { revalidatePath } from "next/cache";

const API_KEY = process.env.HUBSPOT_API_KEY;

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  try {
    const res = await fetch(
      `https://api.hubapi.com/crm/v3/objects/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ properties: { hs_task_status: status } }),
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("HubSpot error");
    revalidatePath("/tasks");
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}
