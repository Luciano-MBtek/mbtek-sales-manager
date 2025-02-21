import z from "zod";

export const emailSchema = z.object({
  senderEmail: z.string().email(),
  receiverEmail: z.string().email(),
  subject: z
    .string()
    .min(1, { message: "You have to add a subject." })
    .max(78, { message: "Subject cannot exceed 78 characters." }),
  content: z
    .string()
    .min(1, { message: "Do not forget the content" })
    .max(10240, { message: "Content cannot exceed 10,240 characters." }),
});

export type emailSchemaType = z.infer<typeof emailSchema>;
