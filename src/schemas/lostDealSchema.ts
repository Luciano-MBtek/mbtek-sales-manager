import z from "zod";
import { closeLostReasonValues } from "@/types";

export const lostDealSchema = z
  .object({
    closed_lost_reason: z.enum(closeLostReasonValues as [string, ...string[]], {
      errorMap: () => ({ message: "Select a reason" }),
    }),
    lost_reason_detail: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.closed_lost_reason === "Other" && !data.lost_reason_detail?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details",
        path: ["lost_reason_detail"],
      });
    }
  });

export type LostDealFormValues = z.infer<typeof lostDealSchema>;
