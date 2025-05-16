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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  stepFiveQualificationSchema,
  StepQualificationFiveFormValues,
} from "@/schemas/leadQualificationSchema";
import { budgetRange, plannedFinancialMethod, YesOrNo } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FormQuestion from "@/components/FormQuestion";

interface StepFiveContentProps {
  onComplete: (data: StepQualificationFiveFormValues) => void;
  initialData: any;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function StepFiveContent({
  onComplete,
  initialData,
  formRef,
}: StepFiveContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StepQualificationFiveFormValues>({
    resolver: zodResolver(stepFiveQualificationSchema),
    defaultValues: {
      defined_a_budget: initialData?.defined_a_budget || "",
      budget_range: initialData?.budget_range || "",
      aware_of_available_financial_incentives:
        initialData?.aware_of_available_financial_incentives || "",
      planned_financial_method: initialData?.planned_financial_method || "",
    },
  });

  const handleSubmit = async (data: StepQualificationFiveFormValues) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* Defined a Budget - Radio Buttons */}
          <FormField
            control={form.control}
            name="defined_a_budget"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormQuestion question="Have you defined a budget?" />
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    {YesOrNo.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`defined-budget-${option}`}
                        />
                        <Label
                          htmlFor={`defined-budget-${option}`}
                          className="text-black"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget Range - Select Dropdown */}
          <FormField
            control={form.control}
            name="budget_range"
            render={({ field }) => (
              <FormItem>
                <FormQuestion question="Budget Range" />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {budgetRange.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Aware of Financial Incentives - Radio Buttons */}
          <FormField
            control={form.control}
            name="aware_of_available_financial_incentives"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormQuestion question="Are you aware of available financial incentives?" />
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    {YesOrNo.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`financial-incentives-${option}`}
                        />
                        <Label
                          htmlFor={`financial-incentives-${option}`}
                          className="text-black"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Planned Financial Method - Select Dropdown */}
          <FormField
            control={form.control}
            name="planned_financial_method"
            render={({ field }) => (
              <FormItem>
                <FormQuestion question="Planned Financial Method" />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select financial method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plannedFinancialMethod.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
