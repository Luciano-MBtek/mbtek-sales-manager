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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  stepTwoQualificationSchema,
  StepQualificationTwoFormValues,
} from "@/schemas/leadQualificationSchema";
import {
  buildingType,
  projectType,
  systemAge,
  currentSystemType,
  mainProjectGoals,
  YesOrNo,
} from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepTwoContentProps {
  onComplete: (data: StepQualificationTwoFormValues) => void;
  initialData: any;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function StepTwoContent({
  onComplete,
  initialData,
  formRef,
}: StepTwoContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StepQualificationTwoFormValues>({
    resolver: zodResolver(stepTwoQualificationSchema),

    defaultValues: {
      building_type: initialData?.building_type || "",
      project_type: initialData?.project_type || "",
      current_system_type: initialData?.current_system_type || null,
      system_age: initialData?.system_age || null,
      main_project_goals: initialData?.main_project_goals || [],
      competitors_previously_contacted:
        initialData?.competitors_previously_contacted || "",
      competitors_name: initialData?.competitors_name || "",
    },
  });

  // Watch fields for conditional rendering
  const selectedProjectType = form.watch("project_type");
  const competitorsContacted = form.watch("competitors_previously_contacted");

  const handleSubmit = async (data: StepQualificationTwoFormValues) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Building Type */}
          <FormField
            control={form.control}
            name="building_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {buildingType.map((option) => (
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

          {/* Project Type */}
          <FormField
            control={form.control}
            name="project_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectType.map((option) => (
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

        {/* Current System Type - Conditional based on Project Type */}
        {selectedProjectType && selectedProjectType !== "new_installation" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="current_system_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current System Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentSystemType.map((option) => (
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

            {/* System Age - Conditional based on Project Type */}
            <FormField
              control={form.control}
              name="system_age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Age</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {systemAge.map((option) => (
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
        )}

        {/* Main Project Goals */}
        <div className="mt-4">
          <FormLabel className="block text-zinc-700 text-md mb-2">
            Main Project Goals (select all that apply)
          </FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mainProjectGoals.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`main-project-goal-${option.value}`}
                  checked={
                    form.watch("main_project_goals")?.includes(option.value) ||
                    false
                  }
                  onCheckedChange={(checked) => {
                    const currentValues =
                      form.watch("main_project_goals") || [];
                    if (checked) {
                      form.setValue("main_project_goals", [
                        ...currentValues,
                        option.value,
                      ]);
                    } else {
                      form.setValue(
                        "main_project_goals",
                        currentValues.filter((v) => v !== option.value)
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`main-project-goal-${option.value}`}
                  className="text-black"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {form.formState.errors.main_project_goals && (
            <p className="text-sm text-red-500 mt-1">
              {
                form.formState.errors.main_project_goals
                  .message as React.ReactNode
              }
            </p>
          )}
        </div>

        {/* Competitors Previously Contacted */}
        <FormField
          control={form.control}
          name="competitors_previously_contacted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Have you consulted other companies before?</FormLabel>
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
                        id={`competitors-contacted-${option}`}
                      />
                      <Label
                        htmlFor={`competitors-contacted-${option}`}
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

        {/* Competitors Name - Conditional based on Previous Contact */}
        {competitorsContacted === "Yes" && (
          <FormField
            control={form.control}
            name="competitors_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which companies did you contact?</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company names" {...field} />
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
