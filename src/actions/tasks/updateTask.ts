// src/actions/tasks/updateTask.ts
"use server";
import { Task } from "@/types/Tasks";
import { revalidatePath } from "next/cache";

const API_KEY = process.env.HUBSPOT_API_KEY;

export async function updateTask(taskId: string, taskData: Partial<Task>) {
  try {
    const res = await fetch(
      `https://api.hubapi.com/crm/v3/objects/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(taskData),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("HubSpot error:", errorData);
      throw new Error("HubSpot error");
    }

    revalidatePath("/tasks");
    return res.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}
