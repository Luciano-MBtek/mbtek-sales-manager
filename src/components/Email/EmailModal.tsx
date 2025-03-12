"use client";

import type React from "react";

import { ChangeEvent, useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { PaperclipIcon, SendIcon, XIcon, Mail, ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
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

interface EmailProps {
  isSideBar: boolean;
}

export default function EmailModal({ isSideBar }: EmailProps) {
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

  const form = useForm<emailSchemaType>({
    mode: "onChange",
    resolver: zodResolver(emailSchema),
    defaultValues: {
      senderEmail: userEmail || "",
      senderName: userName || "",
      receiverEmail: contactEmail || "",
      subject: "",
      content: "",
      contactId: contactId || "",
      attachments: [],
    },
  });

  useEffect(() => {
    form.reset({
      senderEmail: userEmail || "",
      senderName: userName || "",
      receiverEmail: contactEmail || "",
      subject: "",
      content: `<p>Hello ${contactName},</p><img width="126" height="45" src="https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Logo%20Mbtek%20Transparency.png"><em><p>${userName}</p></em><em><p>${userEmail}</p></em>`,
      contactId: contactId || "",
      attachments: [],
    });
  }, [userEmail, contactEmail, form, contactId, userName, contactName]);

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
          description: "Email sent successfully",
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
    setIsLoading(false);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: `File ${file.name} is too large. Maximum size is 10MB`,
          variant: "destructive",
        });
        return;
      }
    }

    const newAttachments = await Promise.all(
      Array.from(files).map(async (file) => {
        const base64 = await convertFileToBase64(file);
        return {
          fileName: file.name,
          mimeType: file.type,
          content: base64,
        };
      })
    );

    const currentAttachments = form.getValues("attachments") || [];
    form.setValue("attachments", [...currentAttachments, ...newAttachments]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isSideBar ? (
          <div className="relative flex cursor-default hover:bg-accent hover:text-accent-foreground select-none justify-between items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
            <span>Send Email</span>
            <Mail width={15} />
          </div>
        ) : (
          <Button className="gap-3">
            Send
            <Mail />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>New Email</DialogTitle>
          <DialogDescription>
            Compose and send your email message.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex w-full justify-between items-center gap-8">
              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Your email"
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ArrowRight width={50} height={50} />
              <FormField
                control={form.control}
                name="receiverEmail"
                render={({ field }) => (
                  <FormItem className="w-full">
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
            </div>

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
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Tiptap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor="attachment"
                          className="cursor-pointer flex items-center gap-2 hover:text-primary"
                        >
                          <PaperclipIcon className="h-5 w-5" />
                          <span>Attach file</span>
                        </Label>
                        <input
                          id="attachment"
                          type="file"
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          {field.value?.length > 0
                            ? `${field.value.length} file(s) attached`
                            : "No file chosen"}
                        </span>
                        {field.value && field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map((file, index) => (
                              <Badge
                                key={index}
                                className="flex items-center gap-2"
                              >
                                {file.fileName}
                                <XIcon
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => {
                                    const newAttachments = field.value.filter(
                                      (_, i) => i !== index
                                    );
                                    form.setValue(
                                      "attachments",
                                      newAttachments
                                    );
                                  }}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
