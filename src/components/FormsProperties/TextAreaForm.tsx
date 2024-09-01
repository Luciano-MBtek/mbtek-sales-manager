"use client";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type TextFormProps = {
  label: string;
  property: string;
  id: string;
};

export function TextAreaForm({ label, property, id }: TextFormProps) {
  // 1. Define your form.
  const formSchema = z.object({
    text: z
      .string()
      .min(2, { message: "Text must be at least 2 characters." })
      .max(1000, { message: "Text must not exceed 1000 characters." })
      .trim()
      .refine((value) => value.split("\n").length <= 10, {
        message: "Text must not exceed 10 lines.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modify {label}</FormLabel>
              <FormControl>
                <Textarea placeholder={label} {...field} />
              </FormControl>
              <FormDescription>This will update {label}.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
