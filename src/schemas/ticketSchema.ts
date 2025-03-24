import { z } from "zod";

export const ticketSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pipeline: z.string().min(1, "Pipeline is required"),
  status: z.string().min(1, "Status is required"),
  category: z.array(z.string()),
  description: z.string(),
  source: z.string(),
  owner: z.string(),
  priority: z.string(),
  createDate: z.date().optional(),
  contactId: z.string(),
});

export const updateTicketSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pipeline: z.string().min(1, "Pipeline is required"),
  status: z.string().min(1, "Status is required"),
  category: z.array(z.string()),
  description: z.string(),
  source: z.string(),
  owner: z.string(),
  priority: z.string(),
  contactId: z.string(),
  ticketId: z.string(),
});

export type ticketSchemaType = z.infer<typeof ticketSchema>;
export type updateTicketSchemaType = z.infer<typeof updateTicketSchema>;
