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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { patchContactProperty } from "@/actions/patchContactProperty";

type OptionProps = {
  value: string;
  label: string;
};

type CheckboxFormProps = {
  label: string;
  options: OptionProps[];
  property: string;
  id: string;
};

const formSchema = z.object({
  selections: z
    .array(z.string())
    .min(1, { message: "Please select at least one option." }),
});

type FormSchema = z.infer<typeof formSchema>;

export function CheckboxForm({
  label,
  options,
  property,
  id,
}: CheckboxFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selections: [],
    },
  });

  const onSubmit = (values: FormSchema) => {
    startTransition(() => {
      const joinedValues = values.selections.join(";");
      patchContactProperty(id, property, joinedValues)
        .then(() => {
          toast({
            title: `${property} updated successfully`,
            description: <p className="text-primary">{joinedValues}</p>,
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
          name="selections"
          render={() => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <div className="space-y-2">
                {options.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="selections"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      option.value,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormDescription>
                Select one or more {label} options.
              </FormDescription>
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
