// src/schemas/taskSchema.ts
import { z } from "zod";

export const updateTaskSchema = z.object({
  hs_task_subject: z.string().min(1, "Task title is required"),
  hs_task_body: z.string().min(1, "Task body is required"),
  hs_task_status: z.string().min(1, "Task status is required"),
  hs_task_type: z.string().min(1, "Task type is required"),
  hs_task_priority: z.string().min(1, "Task priority is required"),
  hubspot_owner_id: z.string().optional(),
  hs_task_queue: z.string().optional(),
  hs_timestamp: z.string().optional(),
});

export type updateTaskSchemaType = z.infer<typeof updateTaskSchema>;
