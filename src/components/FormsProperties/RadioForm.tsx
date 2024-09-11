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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { patchContactProperty } from "@/actions/patchContactProperty";

type OptionProps = {
  value: string;
  label: string;
};

type RadioFormProps = {
  label: string;
  options: OptionProps[];
  property: string;
  id: string;
};

const formSchema = z.object({
  selection: z.string().min(1, { message: "Please select an option." }),
});

type FormSchema = z.infer<typeof formSchema>;

export function RadioForm({ label, options, property, id }: RadioFormProps) {
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
            <FormItem className="space-y-3">
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {options.map((option) => (
                    <FormItem
                      className="flex items-center space-x-3 space-y-0"
                      key={option.value}
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
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
