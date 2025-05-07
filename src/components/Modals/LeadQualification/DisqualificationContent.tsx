"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { disqualificationReason } from "@/types";
import {
  disqualifiedLeadSchema,
  type disqualifiedLeadFormValues,
} from "@/schemas/leadQualificationSchema";
import type { QualificationData } from "@/store/qualification-store";

interface DisqualificationContentProps {
  onComplete: (data: Partial<QualificationData>) => void;
  initialData: QualificationData;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function DisqualificationContent({
  onComplete,
  initialData,
  formRef,
}: DisqualificationContentProps) {
  const form = useForm<disqualifiedLeadFormValues>({
    resolver: zodResolver(disqualifiedLeadSchema),
    defaultValues: {
      hs_lead_status: "Disqualified",
      disqualification_reason: initialData.disqualification_reason || "",
      disqualification_explanation:
        initialData.disqualification_explanation || "",
    },
  });

  const onSubmit = (data: disqualifiedLeadFormValues) => {
    onComplete(data);
  };

  return (
    <div className="py-4">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-destructive mb-2">
          Disqualifying Lead
        </h3>
        <p className="text-sm text-muted-foreground">
          This action will mark the lead as not suitable for further pursuit.
          Please provide a reason for disqualification and any additional notes
          if needed.
        </p>
      </div>

      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <input
            type="hidden"
            {...form.register("hs_lead_status")}
            value="Disqualified"
          />

          <FormField
            control={form.control}
            name="disqualification_reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Disqualification</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {disqualificationReason.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disqualification_explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional notes here..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
