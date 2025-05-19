"use client";

import { useState, useEffect, useCallback, useRef, useTransition } from "react";
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
import { debounce } from "lodash";

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
  const [isPending, startTransition] = useTransition();
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialData?.shipping_country || initialData?.country || ""
  );
  const debouncedFnRef = useRef<((value: string) => void) | null>(null);

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
    } catch (error) {
      console.error("Error al guardar la información:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para precargar datos basados en el código postal
  const handleZipCodeChange = useCallback(
    async (zipCode: string) => {
      if (!zipCode || zipCode.length < 3) {
        return;
      }

      startTransition(async () => {
        try {
          const isCanada = /[a-zA-Z]/.test(zipCode);
          const country = isCanada ? "CA" : "US";
          const postalCode = isCanada
            ? zipCode.slice(0, 3).toUpperCase()
            : zipCode;
          const response = await fetch(
            `https://api.zippopotam.us/${country}/${postalCode}`
          );
          if (!response.ok) {
            console.error("Código postal inválido");
            return;
          }

          const data = await response.json();
          if (!data.places || !data.places[0]) {
            console.error("No se encontró información para este código postal");
            return;
          }

          const placeName = data.places[0]["place name"];
          const locationData = {
            city: placeName.includes("(")
              ? placeName.split("(")[0].trim()
              : placeName,
            state: data.places[0]["state"],
            country: isCanada ? "Canada" : "USA",
          };

          form.setValue("shipping_country", locationData.country);
          form.setValue("shipping_state", locationData.state);
          form.setValue("shipping_city", locationData.city);
          setSelectedCountry(locationData.country);
        } catch (error) {
          console.error("Error al buscar el código postal:", error);
        }
      });
    },
    [form]
  );

  // Crear versión con debounce de handleZipCodeChange
  const debouncedZipCodeChange = useCallback(
    (zipCode: string) => {
      // Limpiar los campos siempre que el usuario escriba
      form.setValue("shipping_country", "");
      form.setValue("shipping_state", "");
      form.setValue("shipping_city", "");
      setSelectedCountry("");

      if (zipCode.length < 3) {
        if (debouncedFnRef.current) {
          (debouncedFnRef.current as any).cancel?.();
        }
        return;
      }

      if (!debouncedFnRef.current) {
        debouncedFnRef.current = debounce((value: string) => {
          handleZipCodeChange(value);
        }, 1000);
      }
      debouncedFnRef.current(zipCode);
    },
    [handleZipCodeChange, form]
  );

  // Observar cambios en el código postal
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "shipping_zip_code") {
        debouncedZipCodeChange(value.shipping_zip_code || "");
      }
    });
    return () => {
      subscription.unsubscribe();
      if (debouncedFnRef.current) {
        (debouncedFnRef.current as any).cancel?.();
      }
    };
  }, [form, debouncedZipCodeChange]);

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
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="shipping_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input value={field.value} readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
