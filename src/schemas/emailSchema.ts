import z from "zod";

export const emailSchema = z.object({
  senderEmail: z.string().email(),
  senderName: z
    .string()
    .min(1, { message: "Missing Sender's name" })
    .max(50, { message: "Sender's name cannot be so long..." }),
  receiverEmail: z.string().email(),

  subject: z
    .string()
    .min(1, { message: "You have to add a subject." })
    .max(78, { message: "Subject cannot exceed 78 characters." }),
  content: z
    .string()
    .min(1, { message: "Do not forget the content" })
    .max(10240, { message: "Content cannot exceed 10,240 characters." }),
  contactId: z.string().min(1, { message: "Contact ID is required" }),
  attachments: z
    .array(
      z.object({
        fileName: z
          .string()
          .min(1, { message: "The file name is required" })
          .max(255, { message: "The file name is too long" }),
        mimeType: z.string().min(1, { message: "The MIME type is required" }),
        content: z
          .string()
          .min(1, { message: "The file content is required" })
          .max(52428800, { message: "The file cannot exceed 50MB" }),
      })
    )
    .default([]),
});

export type emailSchemaType = z.infer<typeof emailSchema>;
