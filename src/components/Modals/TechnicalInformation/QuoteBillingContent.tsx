import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import PhoneInputForm from "@/components/StepForm/PhoneInputForm";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useTransition,
} from "react";
import { debounce } from "lodash";
import { BillingFormValues } from "@/types/complete-system/billingTypes";

interface QuoteBillingContentProps {
  onComplete: (data: BillingFormValues) => void;
  initialData?: Partial<BillingFormValues>;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function QuoteBillingContent({
  onComplete,
  initialData = {},
  formRef,
}: QuoteBillingContentProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialData?.country || ""
  );
  const [stateFullName, setStateFullName] = useState<string>("");
  const debouncedFnRef = useRef<((value: string) => void) | null>(null);
  const form = useForm<BillingFormValues>({
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      city: initialData.city || "",
      state: initialData.state || "",
      country: initialData.country || "",
      zipCode: initialData.zipCode || "",
    },
  });

  const handleSubmit = async (data: BillingFormValues) => {
    await onComplete(data);
  };

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
            console.error("Invalid postal code");
            return;
          }

          const data = await response.json();
          if (!data.places || !data.places[0]) {
            console.error("No information found for this postal code");
            return;
          }

          const placeName = data.places[0]["place name"];
          const locationData = {
            city: placeName.includes("(")
              ? placeName.split("(")[0].trim()
              : placeName,
            state: data.places[0]["state"],
            stateAbbreviation: data.places[0]["state abbreviation"],
            country: isCanada ? "Canada" : "USA",
          };

          form.setValue("country", locationData.country);
          form.setValue("state", locationData.state);
          form.setValue("city", locationData.city);
          setSelectedCountry(locationData.country);
          setStateFullName(locationData.state);
        } catch (error) {
          console.error("Error looking up postal code:", error);
        }
      });
    },
    [form]
  );

  const debouncedZipCodeChange = useCallback(
    (zipCode: string) => {
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
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
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
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <PhoneInputForm
                    id="phone"
                    name="phone"
                    value={field.value || ""}
                    onChange={field.onChange}
                    label={false}
                  />
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
                  <Input placeholder="Enter zip code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(selectedCountry === "USA" || selectedCountry === "Canada") && (
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input
                      value={stateFullName}
                      readOnly
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="12345 street" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-sm text-gray-500">* Required fields</div>
      </form>
    </Form>
  );
}
