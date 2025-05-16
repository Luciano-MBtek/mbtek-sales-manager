"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowBigRight, FileText, SendIcon, XIcon } from "lucide-react";
import { useContactStore } from "@/store/contact-store";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "./Tiptap";
import { useForm } from "react-hook-form";
import { emailSchemaType, emailSchema } from "@/schemas/emailSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "../ui/use-toast";
import { Quote } from "@/types/quoteTypes";

interface TemplateModalProps {
  quote: Quote;
}

export default function TemplateModal({ quote }: TemplateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { contact } = useContactStore();
  const { data } = useSession();
  const { toast } = useToast();

  const userEmail = data?.user.email;
  const userName = data?.user.name;

  const contactEmail = contact?.email;
  const contactId = contact?.id;
  const contactName = contact?.firstname;

  const quoteName = quote.properties.hs_title;
  const quoteAmount = parseFloat(
    quote.properties.hs_quote_amount
  ).toLocaleString("en-US", { minimumFractionDigits: 2 });

  // Create default template with quote information
  const defaultTemplate = `
     <p>Dear ${contactName},</p>
    <p>Thank you for your interest in MBtek's heating and cooling solutions. I've prepared a customized quotation based on your specific requirements that we discussed.</p>
    <p>Your personalized quotation is ready to view. Simply click the link below to access all the details, including pricing, product specifications, and installation timeline:</p>
    <p style="text-align: center; margin: 25px 0;">
      <a href="${quote.properties.hs_quote_link}" style="background-color: #FF6700; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">VIEW YOUR QUOTATION</a>
    </p>
    <p>This quote is valid for the next 30 days. Should you have any questions about the proposed system, financing options, or wish to schedule an installation, please don't hesitate to contact me directly.</p>
    <p>You can reach me by:</p>
    <ul>
      <li>Replying to this email</li>
      <li>Calling: 1-888-301-0737 (Mon-Fri, 8am-6pm)</li>
    </ul>
    <p>Thank you for considering MBtek for your home comfort needs. We look forward to delivering excellent service and premium quality solutions.</p>
    <p>Warm regards,</p>
    <img width="126" height="45" src="https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Logo%20Mbtek%20Transparency.png">
    <p><em>${userName}</em></p>
    <p><em>MBtek Heating & Cooling Specialist</em></p>
    <p><em>${userEmail}</em></p>
  `;

  const form = useForm<emailSchemaType>({
    mode: "onChange",
    resolver: zodResolver(emailSchema),
    defaultValues: {
      senderEmail: userEmail || "",
      senderName: userName || "",
      receiverEmail: contactEmail || "",
      subject: "Your Personalized MBtek Heating & Cooling Quotation",
      content: defaultTemplate,
      contactId: contactId || "",
      attachments: [],
    },
  });

  useEffect(() => {
    if (contact && quote) {
      const defaultTemplate = `
         <p>Dear ${contactName},</p>
        <p>Thank you for your interest in MBtek's heating and cooling solutions. I've prepared a customized quotation based on your specific requirements that we discussed.</p>
        <p>Your personalized quotation is ready to view. Simply click the link below to access all the details, including pricing, product specifications, and installation timeline:</p>
        <p style="text-align: center; margin: 25px 0;">
      <a href="${quote.properties.hs_quote_link}" style="background-color: #FF6700; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">VIEW YOUR QUOTATION</a>
    </p>
        <p>This quote is valid for the next 30 days. Should you have any questions about the proposed system, financing options, or wish to schedule an installation, please don't hesitate to contact me directly.</p>
        <p>You can reach me by:</p>
        <ul>
          <li>Replying to this email</li>
          <li>Calling: 1-888-301-0737 (Mon-Fri, 8am-6pm)</li>
        </ul>
        <p>Thank you for considering MBtek for your home comfort needs. We look forward to delivering excellent service and premium quality solutions.</p>
        <p>Warm regards,</p>
        <img width="126" height="45" src="https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Logo%20Mbtek%20Transparency.png">
        <p><em>${userName}</em></p>
        <p><em>MBtek Heating & Cooling Specialist</em></p>
        <p><em>${userEmail}</em></p>
      `;

      form.reset({
        senderEmail: userEmail || "",
        senderName: userName || "",
        receiverEmail: contactEmail || "",
        subject: "Your Personalized MBtek Heating & Cooling Quotation",
        content: defaultTemplate,
        contactId: contactId || "",
        attachments: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userEmail,
    userName,
    contactEmail,
    contactId,
    contactName,
    quote,
    form,
    quoteName,
    quoteAmount,
  ]);

  const onSubmit = async (values: emailSchemaType) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok) {
        setIsOpen(false);
        toast({
          title: "Success",
          description: "Email with template sent successfully",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          <ArrowBigRight className="mr-2 h-4 w-4" />
          Send Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Email with Template</DialogTitle>
          <DialogDescription>
            Send an email with predefined quote template.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="receiverEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Recipient's email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Email subject" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senderEmail"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senderName"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <FormControl>
                    <Tiptap
                      content={field.value}
                      onChange={field.onChange}
                      readOnly={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                <XIcon className="mr-2 h-4 w-4" />
                Close
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <SendIcon className="mr-2 h-4 w-4" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
