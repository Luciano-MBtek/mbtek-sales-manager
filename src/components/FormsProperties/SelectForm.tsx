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
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { patchContactProperty } from "@/actions/patchContactProperty";

type OptionProps = {
  value: string;
  label: string;
};

type SelectFormProps = {
  label: string;
  options: OptionProps[];
  property: string;
  id: string;
};

const formSchema = z.object({
  selection: z.string().min(1, { message: "Please select an option." }),
});

type FormSchema = z.infer<typeof formSchema>;

export function SelectForm({ label, options, property, id }: SelectFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selection: "",
    },
  });

  const onSubmit = (values: FormSchema) => {
    startTransition(() => {
      patchContactProperty(id, property, values.selection)
        .then(() => {
          toast({
            title: `${property} updated successfully`,
            description: <p className="text-primary">{values.selection}</p>,
          });
        })
        .catch((error) => {
          toast({
            title: "Error updating property",
            description: <p className="text-destructive">{error.message}</p>,
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
          name="selection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select {label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
