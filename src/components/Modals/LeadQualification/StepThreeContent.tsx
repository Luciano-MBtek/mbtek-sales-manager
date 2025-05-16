"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  stepThreeQualificationSchema,
  StepQualificationThreeFormValues,
} from "@/schemas/leadQualificationSchema";
import { desiredTimeframe, decisiveTimingFactor } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

interface StepThreeContentProps {
  onComplete: (data: StepQualificationThreeFormValues) => void;
  initialData: any;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function StepThreeContent({
  onComplete,
  initialData,
  formRef,
}: StepThreeContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StepQualificationThreeFormValues>({
    resolver: zodResolver(stepThreeQualificationSchema),
    defaultValues: {
      desired_timeframe: initialData?.desired_timeframe || "",
      decisive_timing_factor: initialData?.decisive_timing_factor || [],
      other_timing_factor: initialData?.other_timing_factor || "",
    },
  });

  // Watch the decisive timing factor field to conditionally render the other input
  const decisiveFactors = form.watch("decisive_timing_factor");
  const showOtherInput = decisiveFactors?.includes("other");

  // Watch the desired timeframe to show the urgent message
  const timeframe = form.watch("desired_timeframe");
  const isUrgent = timeframe === "urgent";

  const handleSubmit = async (data: StepQualificationThreeFormValues) => {
    setIsSubmitting(true);
    try {
      await onComplete(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
        {/* Desired Timeframe - Radio Buttons */}
        <FormField
          control={form.control}
          name="desired_timeframe"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Desired Timeframe</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {desiredTimeframe.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`timeframe-${option.value}`}
                      />
                      <Label
                        htmlFor={`timeframe-${option.value}`}
                        className="text-black"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Urgent Notification Card */}
        {isUrgent && (
          <Card className="bg-[#FFF9C4] border border-[#FFF9C4] shadow-md mt-2">
            <CardContent className="pt-4">
              <p className="text-[#B87333] font-medium">
                Your situation is being treated as a priority. One of our
                experts will contact you within 24 hours to schedule a technical
                visit.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Decisive Timing Factors - Checkboxes */}
        <div className="mt-4">
          <FormLabel className="block text-zinc-700 text-md mb-2">
            Decisive Timing Factors (select all that apply)
          </FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {decisiveTimingFactor.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`timing-factor-${option.value}`}
                  checked={
                    form
                      .watch("decisive_timing_factor")
                      ?.includes(option.value) || false
                  }
                  onCheckedChange={(checked) => {
                    const currentValues =
                      form.watch("decisive_timing_factor") || [];
                    if (checked) {
                      form.setValue("decisive_timing_factor", [
                        ...currentValues,
                        option.value,
                      ]);
                    } else {
                      form.setValue(
                        "decisive_timing_factor",
                        currentValues.filter((v) => v !== option.value)
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`timing-factor-${option.value}`}
                  className="text-black"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {form.formState.errors.decisive_timing_factor && (
            <p className="text-sm text-red-500 mt-1">
              {
                form.formState.errors.decisive_timing_factor
                  .message as React.ReactNode
              }
            </p>
          )}
        </div>

        {/* Other Timing Factor - Conditional Input */}
        {showOtherInput && (
          <FormField
            control={form.control}
            name="other_timing_factor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please specify other timing factor</FormLabel>
                <FormControl>
                  <Input placeholder="Enter other timing factor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
