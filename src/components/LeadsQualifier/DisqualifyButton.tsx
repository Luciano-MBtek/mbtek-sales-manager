"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createDisqualifyProperties } from "@/lib/utils";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { disqualificationReason, LeadProps } from "@/types";
import {
  disqualifiedLeadSchema,
  type disqualifiedLeadFormValues,
} from "@/schemas/leadQualificationSchema";

interface DisqualifyButtonProps {
  lead: LeadProps;
  className?: string;
}

export default function DisqualifyButton({
  lead,
  className,
}: DisqualifyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<disqualifiedLeadFormValues>({
    resolver: zodResolver(disqualifiedLeadSchema),
    defaultValues: {
      hs_lead_status: "Disqualified",
      disqualification_reason: "",
      disqualification_explanation: "",
    },
  });

  const handleDisqualify = async (data: disqualifiedLeadFormValues) => {
    setIsSaving(true);

    try {
      if (!lead.id) {
        toast({
          title: "Error",
          description: "Contact ID not found",
          variant: "destructive",
        });
        return;
      }

      await patchContactProperties(
        lead.id,
        createDisqualifyProperties({
          hs_lead_status: "Disqualified",
          disqualification_reason: data.disqualification_reason || "",
          disqualification_explanation: data.disqualification_explanation || "",
        })
      );

      toast({
        title: "Success",
        description: "Lead has been disqualified",
      });

      setIsOpen(false);

      // Refresh the page to update the lead status
      router.refresh();
    } catch (error) {
      console.error("Error disqualifying lead:", error);
      toast({
        title: "Error",
        description: "Failed to disqualify lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={className}
        variant="destructive"
      >
        Disqualify
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Disqualification Reason
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-destructive mb-2">
                Disqualifying Lead
              </h3>
              <p className="text-sm text-muted-foreground">
                This action will mark the lead as not suitable for further
                pursuit. Please provide a reason for disqualification and any
                additional notes if needed.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleDisqualify)}
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
                              <SelectItem
                                key={reason.value}
                                value={reason.value}
                              >
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

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-[200px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-[200px]"
                    disabled={isSaving}
                    variant="destructive"
                  >
                    {isSaving ? "Disqualifying..." : "Confirm Disqualification"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
