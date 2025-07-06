"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { lostDealSchema, LostDealFormValues } from "@/schemas/lostDealSchema";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { closeLostReasons } from "@/types";
import { dealStage } from "@/app/mydeals/utils";
import { useState } from "react";

interface DealLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
  pipeline: string;
}

export function DealLostModal({ isOpen, onClose, dealId, pipeline }: DealLostModalProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<LostDealFormValues>({
    resolver: zodResolver(lostDealSchema),
    defaultValues: {
      closed_lost_reason: "Too High Pricing",
      lost_reason_detail: "",
    },
  });

  const onSubmit = async (data: LostDealFormValues) => {
    setIsSaving(true);
    try {
      await patchDealProperties(dealId, {
        closed_lost_reason: data.closed_lost_reason as any,
        lost_reason_detail: data.lost_reason_detail ?? "",
        dealstage:
          pipeline === "732661879"
            ? dealStage["Closed Lost - Complete System"]
            : dealStage["Closed Lost"],
      });
      toast({ title: "Deal updated", description: "Deal marked as lost." });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update deal", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Mark Deal as Lost</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Please select the reason why this deal was lost.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="closed_lost_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lost Reason</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {closeLostReasons.map((reason) => (
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

              {form.watch("closed_lost_reason") === "Other" && (
                <FormField
                  control={form.control}
                  name="lost_reason_detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason Detail</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} variant="destructive">
                  {isSaving ? "Saving..." : "Confirm"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DealLostModal;
