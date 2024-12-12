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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { patchContactProperty } from "@/actions/patchContactProperty";
import { phoneSchema } from "@/schemas/newLeadSchema";

type PhoneFormProps = {
  label: string;
  property: string;
  id: string;
};

const formSchema = z.object({
  text: phoneSchema,
});

type FormSchema = z.infer<typeof formSchema>;

export function PhoneForm({ label, property, id }: PhoneFormProps) {
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
                <Input placeholder={label} {...field} />
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
