"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QuoteBillingContent from "@/components/Modals/TechnicalInformation/QuoteBillingContent";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  ContactFormValues,
  convertContactFormToUpdateData,
} from "@/types/quick-quote/contactTypes";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { useToast } from "@/components/ui/use-toast";

interface StepOneQuickQuoteFormProps {
  dealId: string;
  contactId: string;
  initialData: Partial<ContactFormValues>;
}

export default function StepOneQuickQuoteForm({
  dealId,
  contactId,
  initialData,
}: StepOneQuickQuoteFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleComplete = async (data: ContactFormValues) => {
    setLoading(true);
    try {
      await patchContactProperties(
        contactId,
        convertContactFormToUpdateData(data)
      );
      toast({
        title: "Contact Updated",
        description: "The contact was updated successfully.",
        variant: "default",
      });
      router.push(`/deals/quick-quote/${contactId}/quote/${dealId}/step-two`);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the contact.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <div className="space-y-6">
      <QuoteBillingContent
        onComplete={handleComplete}
        initialData={initialData}
        formRef={formRef}
      />
      <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
