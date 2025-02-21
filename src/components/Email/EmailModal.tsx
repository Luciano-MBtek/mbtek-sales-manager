"use client";

import type React from "react";

import { useEffect, useState } from "react";
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

interface EmailProps {
  isSideBar: boolean;
}

export default function EmailModal({ isSideBar }: EmailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { contact } = useContactStore();
  const { data } = useSession();

  const userEmail = data?.user.email;
  const contactEmail = contact?.email;

  const form = useForm<emailSchemaType>({
    mode: "onChange",
    resolver: zodResolver(emailSchema),
    defaultValues: {
      senderEmail: userEmail || "",
      receiverEmail: contactEmail || "",
      subject: "",
      content: "",
    },
  });

  useEffect(() => {
    form.reset({
      senderEmail: userEmail || "",
      receiverEmail: contactEmail || "",
      subject: "",
      content: `<h2 class="text-xl font-bold" levels="2">Testing with Image</h2><ol><li><p>primero</p></li><li><p>segundo</p></li><li><p>tercero</p></li></ol><ul class="list-disc ml-4"><li><p>Bullet 1</p></li><li><p>Bullet 2</p></li><li><p>Bullet 3</p></li></ul><h2 class="text-xl font-bold" levels="2">Wacho </h2><p></p><img width="126" height="45" src="https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Logo%20Mbtek%20Transparency.png"><p></p>`,
    });
  }, [userEmail, contactEmail, form]);

  const onSubmit = async (values: emailSchemaType) => {
    setIsLoading(true);
    console.log("Email content:", values);

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isSideBar ? (
          <div className="flex w-full items-center justify-between gap-2">
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
              <div className="flex items-center space-x-2">
                <Label htmlFor="attachment" className="cursor-pointer">
                  <PaperclipIcon className="h-5 w-5" />
                  <span className="sr-only">Attach file</span>
                </Label>
                <Input id="attachment" type="file" className="hidden" />
                <span className="text-sm text-muted-foreground">
                  No file chosen
                </span>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="mr-2 h-4 w-4" />
                  Close
                </Button>
                <Button type="submit">
                  <SendIcon className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
