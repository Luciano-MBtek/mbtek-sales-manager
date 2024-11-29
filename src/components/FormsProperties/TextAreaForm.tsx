"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { patchContactProperty } from "@/actions/patchContactProperty";

type TextAreaFormProps = {
  label: string;
  property: string;
  id: string;
};

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

type FormSchema = z.infer<typeof formSchema>;

export function TextAreaForm({ label, property, id }: TextAreaFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = (values: FormSchema) => {
    startTransition(() => {
      patchContactProperty(id, property, values.text)
        .then(() => {
          toast({
            title: `${property} updated successfully`,
            description: <p className="text-primary">{values.text}</p>,
          });
        })
        .catch((error) => {
          toast({
            title: "Error updating property",
            description: <p className="text-secondary">{error.message}</p>,
            variant: "destructive",
          });
        });
    });
  };

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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
