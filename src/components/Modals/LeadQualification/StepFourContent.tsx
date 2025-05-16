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

import { Textarea } from "@/components/ui/textarea";

import {
  stepFourQualificationSchema,
  StepQualificationFourFormValues,
} from "@/schemas/leadQualificationSchema";
import { decisionMakingStatus, propertyType, typeOfDecision } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StepFourContentProps {
  onComplete: (data: StepQualificationFourFormValues) => void;
  initialData: any;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function StepFourContent({
  onComplete,
  initialData,
  formRef,
}: StepFourContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StepQualificationFourFormValues>({
    resolver: zodResolver(stepFourQualificationSchema),
    defaultValues: {
      decision_making_status: initialData?.decision_making_status || "",
      property_type: initialData?.property_type || "",
      type_of_decision: initialData?.type_of_decision || "",
      additional_comments: initialData?.additional_comments || "",
    },
  });

  const handleSubmit = async (data: StepQualificationFourFormValues) => {
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
        <div className="grid grid-cols-2 gap-4">
          {/* Decision Making Status - Radio Buttons */}
          <FormField
            control={form.control}
            name="decision_making_status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Decision Making Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {decisionMakingStatus.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`decision-status-${option.value}`}
                        />
                        <Label
                          htmlFor={`decision-status-${option.value}`}
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

          {/* Property Type - Radio Buttons */}
          <FormField
            control={form.control}
            name="property_type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Property Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {propertyType.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`property-type-${option.value}`}
                        />
                        <Label
                          htmlFor={`property-type-${option.value}`}
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

          {/* Type of Decision - Radio Buttons */}
          <FormField
            control={form.control}
            name="type_of_decision"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Type of Decision</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {typeOfDecision.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`decision-type-${option.value}`}
                        />
                        <Label
                          htmlFor={`decision-type-${option.value}`}
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
        </div>
        {/* Additional Comments - Textarea */}
        <FormField
          control={form.control}
          name="additional_comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Comments (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional information about the decision-making process"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
