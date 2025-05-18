"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  stepSevenQualificationSchema,
  StepSevenQualificationFormValues,
} from "@/schemas/leadQualificationSchema";

interface StepSevenContentProps {
  onComplete: (data: StepSevenQualificationFormValues) => void;
  initialData: any;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function StepSevenContent({
  onComplete,
  initialData,
  formRef,
}: StepSevenContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialData?.shipping_country || initialData?.country || ""
  );

  const form = useForm<StepSevenQualificationFormValues>({
    resolver: zodResolver(stepSevenQualificationSchema),
    defaultValues: {
      shipping_address: initialData?.shipping_address || "",
      shipping_city: initialData?.shipping_city || initialData?.city || "",
      shipping_state: initialData?.shipping_state || initialData?.state || "",
      shipping_zip_code:
        initialData?.shipping_zip_code || initialData?.zipCode || "",
      shipping_country:
        initialData?.shipping_country || initialData?.country || "",
      shipping_notes: initialData?.shipping_notes || "",
    },
  });

  const handleSubmit = async (data: StepSevenQualificationFormValues) => {
    setIsSubmitting(true);
    try {
      await onComplete(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para precargar datos basados en el código postal
  const handleZipCodeChange = useCallback(
    async (zipCode: string) => {
      if (zipCode.length >= 5) {
        try {
          // Aquí deberías hacer la llamada a tu API para obtener los datos del código postal
          // Por ahora usamos un mock
          const mockData = {
            city: "Sample City",
            state: "Sample test",
            country: zipCode.length === 6 ? "Canada" : "USA",
            address: "Sample Address",
          };

          // Actualizar los campos del formulario
          form.setValue("shipping_city", mockData.city);
          form.setValue("shipping_state", mockData.state);
          form.setValue("shipping_country", mockData.country);
          form.setValue("shipping_address", mockData.address);
          // Actualizar el estado del país
          setSelectedCountry(mockData.country);
        } catch (error) {
          console.error("Error fetching zip code data:", error);
        }
      }
    },
    [form]
  );

  // Observar cambios en el código postal
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "shipping_zip_code") {
        handleZipCodeChange(value.shipping_zip_code || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, handleZipCodeChange]);

  // Efecto para cargar datos iniciales si hay un zipCode
  useEffect(() => {
    if (initialData?.zipCode) {
      handleZipCodeChange(initialData.zipCode);
    }
  }, [initialData?.zipCode, handleZipCodeChange]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
        <FormField
          control={form.control}
          name="shipping_zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter zip code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shipping_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input value={field.value} readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(selectedCountry === "USA" || selectedCountry === "Canada") && (
            <FormField
              control={form.control}
              name="shipping_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {selectedCountry === "USA" ? "State" : "Province"}
                  </FormLabel>
                  <FormControl>
                    <Input value={field.value} readOnly className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="shipping_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter shipping address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shipping_city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shipping_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any special instructions for shipping..."
                  className="min-h-[100px]"
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
