"use client";

import { useState, useEffect, useCallback, useRef, useTransition } from "react";
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
import debounce from "lodash/debounce";

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
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contact } = useContactStore();
  const { data: session } = useSession();
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialData?.country || ""
  );
  const [stateFullName, setStateFullName] = useState<string>("");

  const hubspotOwnerId = session?.user.hubspotOwnerId;

  const form = useForm<StepQualificationOneFormValues>({
    resolver: zodResolver(stepOneLeadQualificationSchema),
    defaultValues: {
      name: initialData?.name || contact?.firstname || "",
      lastname: initialData?.lastname || contact?.lastname || "",
      email: initialData?.email || contact?.email || "",
      phone: initialData?.phone || contact?.phone || "",
      zipCode: initialData?.zipCode || "",
      country: initialData?.country || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
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
    } catch (error) {
      console.error("Error al guardar la información:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const debouncedFnRef = useRef<((value: string) => void) | null>(null);

  // Función para precargar datos basados en el código postal
  const handleZipCodeChange = useCallback(
    async (zipCode: string) => {
      console.log("handleZipCodeChange llamado con:", zipCode);
      if (!zipCode || zipCode.length < 3) {
        return;
      }

      startTransition(async () => {
        try {
          console.log("Intentando obtener datos de ubicación...");
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

          console.log("Llegó a procesar los datos:", data.places[0]);
          const placeName = data.places[0]["place name"];
          const locationData = {
            city: placeName.includes("(")
              ? placeName.split("(")[0].trim()
              : placeName,
            state: isCanada ? data.places[0]["state"] : data.places[0]["state"],
            stateAbbreviation: data.places[0]["state abbreviation"],
            country: isCanada ? "Canada" : "USA",
          };

          form.setValue("country", locationData.country);
          if (isCanada) {
            form.setValue("province", locationData.stateAbbreviation);
            form.setValue("state", "");
          } else {
            form.setValue("state", locationData.state);
            form.setValue("province", "");
          }
          form.setValue("city", locationData.city);
          setSelectedCountry(locationData.country);
          setStateFullName(locationData.state);
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
      form.setValue("country", "");
      form.setValue("state", "");
      form.setValue("city", "");
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
      if (name === "zipCode") {
        debouncedZipCodeChange(value.zipCode || "");
      }
    });
    return () => {
      subscription.unsubscribe();
      if (debouncedFnRef.current) {
        (debouncedFnRef.current as any).cancel?.();
      }
    };
  }, [form, debouncedZipCodeChange]);

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

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Zip Code"
                  {...field}
                  onChange={(e) => {
                    // Solo permitir letras y números
                    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
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

          <FormField
            control={form.control}
            name={selectedCountry === "Canada" ? "province" : "state"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {selectedCountry === "USA" ? "State" : "Province"}
                </FormLabel>
                <FormControl>
                  <Input value={stateFullName} readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="city"
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
