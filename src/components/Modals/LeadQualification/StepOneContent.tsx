"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContactStore } from "@/store/contact-store";
import {
  stepOneLeadQualificationSchema,
  StepQualificationOneFormValues,
} from "@/schemas/leadQualificationSchema";
import { currentSituation, hearAboutUs, leadType, lookingFor } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "next-auth/react";

interface StepOneContentProps {
  onComplete: (data: StepQualificationOneFormValues) => void;
  initialData: any;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function StepOneContent({
  onComplete,
  initialData,
  formRef,
}: StepOneContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contact } = useContactStore();
  const { data: session } = useSession();

  const hubspotOwnerId = session?.user.hubspotOwnerId;

  const form = useForm<StepQualificationOneFormValues>({
    resolver: zodResolver(stepOneLeadQualificationSchema),
    defaultValues: {
      name: initialData?.name || contact?.firstname || "",
      lastname: initialData?.lastname || contact?.lastname || "",
      email: initialData?.email || contact?.email || "",
      phone: initialData?.phone || contact?.phone || "",
      zipCode: initialData?.zipCode || "",
      leadType: initialData?.leadType || "",
      hearAboutUs: initialData?.hearAboutUs || "",
      currentSituation: initialData?.currentSituation || [],
      lookingFor: initialData?.lookingFor || "",
      lead_owner_id: hubspotOwnerId,
    },
  });

  const handleSubmit = async (data: StepQualificationOneFormValues) => {
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
        className="space-y-2 py-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Zip Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="leadType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lead type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leadType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hearAboutUs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hearAboutUs.map((option) => (
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

        <div className="grid grid-cols-2 gap-4">
          <div className="mt-4">
            <FormLabel className="block text-zinc-700 text-md mb-2">
              Current Situation
            </FormLabel>
            <div className="space-y-2">
              {currentSituation.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-situation-${option.value}`}
                    checked={
                      form.watch("currentSituation")?.includes(option.value) ||
                      false
                    }
                    onCheckedChange={(checked) => {
                      const currentValues =
                        form.watch("currentSituation") || [];
                      if (checked) {
                        form.setValue("currentSituation", [
                          ...currentValues,
                          option.value,
                        ]);
                      } else {
                        form.setValue(
                          "currentSituation",
                          currentValues.filter((v) => v !== option.value)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={`current-situation-${option.value}`}
                    className="text-black"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {form.formState.errors.currentSituation && (
              <p className="text-sm text-red-500 mt-1">
                {
                  form.formState.errors.currentSituation
                    .message as React.ReactNode
                }
              </p>
            )}
          </div>

          <FormField
            control={form.control}
            name="lookingFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-zinc-700 text-md mb-2">
                  Looking For
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {lookingFor.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`looking-for-${option.value}`}
                        />
                        <Label
                          htmlFor={`looking-for-${option.value}`}
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
      </form>
    </Form>
  );
}
