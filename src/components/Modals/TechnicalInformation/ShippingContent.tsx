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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInputForm from "@/components/StepForm/PhoneInputForm";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useTransition,
} from "react";
import { debounce } from "lodash";

// Me falta validar estos valores
const deliveryTypes = [
  { value: "residential", label: "Residential (requires a liftgate)" },
  { value: "commercial", label: "Commercial (access to a dock or a forklift)" },
  { value: "pickup", label: "Pickup to our warehouse" },
];

const dropoffConditions = [
  { value: "semi_trailer", label: "Easy Access for a Semi-Trailer" },
  { value: "van_only", label: "Access for a Delivery Van only" },
];

export interface ShippingFormValues {
  sameAsBilling: boolean;
  delivery_type: string;
  dropoff_condition: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_country: string;
  shipping_zip_code: string;
}

interface ShippingContentProps {
  onComplete: (data: ShippingFormValues) => void;
  initialData?: Partial<ShippingFormValues>;
  billingData?: any;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function ShippingContent({
  onComplete,
  initialData = {},
  billingData,
  formRef,
}: ShippingContentProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialData?.shipping_country || ""
  );
  const [stateFullName, setStateFullName] = useState<string>("");
  const debouncedFnRef = useRef<((value: string) => void) | null>(null);
  const isAutoFilling = useRef(false);
  const form = useForm<ShippingFormValues>({
    defaultValues: {
      sameAsBilling: false,
      delivery_type: initialData?.delivery_type || "",
      dropoff_condition: initialData?.dropoff_condition || "",
      shipping_first_name: initialData?.shipping_first_name || "",
      shipping_last_name: initialData?.shipping_last_name || "",
      shipping_email: initialData?.shipping_email || "",
      shipping_phone: initialData?.shipping_phone || "",
      shipping_address: initialData?.shipping_address || "",
      shipping_city: initialData?.shipping_city || "",
      shipping_province: initialData?.shipping_province || "",
      shipping_country: initialData?.shipping_country || "",
      shipping_zip_code: initialData?.shipping_zip_code || "",
    },
  });

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
            stateAbbreviation: data.places[0]["state abbreviation"],
            country: isCanada ? "Canada" : "USA",
          };

          form.setValue("shipping_country", locationData.country);
          form.setValue("shipping_province", locationData.state);
          form.setValue("shipping_city", locationData.city);
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
      form.setValue("shipping_country", "");
      form.setValue("shipping_province", "");
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

  // Observar cambios en el código postal SOLO si sameAsBilling es false
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "shipping_zip_code" &&
        !form.getValues("sameAsBilling") // Solo si no está tildado
      ) {
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
    if (initialData?.shipping_zip_code) {
      handleZipCodeChange(initialData.shipping_zip_code);
    }
  }, [initialData?.shipping_zip_code, handleZipCodeChange]);

  // Copiar datos de billing al marcar sameAsBilling
  useEffect(() => {
    if (form.watch("sameAsBilling") && billingData) {
      isAutoFilling.current = true;
      form.setValue("shipping_first_name", billingData.firstName || "");
      form.setValue("shipping_last_name", billingData.lastName || "");
      form.setValue("shipping_email", billingData.email || "");
      form.setValue("shipping_phone", billingData.phone || "");
      form.setValue("shipping_address", billingData.address || "");
      form.setValue("shipping_city", billingData.city || "");
      form.setValue("shipping_province", billingData.state || "");
      form.setValue("shipping_country", billingData.country || "");
      form.setValue("shipping_zip_code", billingData.zipCode || "");
      isAutoFilling.current = false;
    }
    // eslint-disable-next-line
  }, [form.watch("sameAsBilling")]);

  // Destildar sameAsBilling si se modifica cualquier campo de envío manualmente
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (
        form.getValues("sameAsBilling") &&
        typeof name === "string" &&
        [
          "shipping_firstName",
          "shipping_lastName",
          "shipping_email",
          "shipping_phone",
          "shipping_address",
          "shipping_city",
          "shipping_province",
          "shipping_country",
          "shipping_zip_code",
        ].includes(name) &&
        !isAutoFilling.current
      ) {
        form.setValue("sameAsBilling", false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: ShippingFormValues) => {
    await onComplete(data);
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        name="shipping-form"
        id="shipping-form"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="delivery_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deliveryTypes.map((option) => (
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
          <FormField
            control={form.control}
            name="dropoff_condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dropoff location condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropoffConditions.map((option) => (
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
        <div className="font-semibold mt-4 mb-2">
          Shipping address (address & contact)
        </div>
        <FormField
          control={form.control}
          name="sameAsBilling"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mr-2"
                />
              </FormControl>
              <FormLabel>Same as billing</FormLabel>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shipping_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="shipping-first-name"
                    name="shipping-first-name"
                    autoComplete="given-name"
                    disabled={form.watch("sameAsBilling")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shipping_last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="shipping-last-name"
                    name="shipping-last-name"
                    autoComplete="family-name"
                    disabled={form.watch("sameAsBilling")}
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
            name="shipping_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="shipping-email"
                    name="shipping-email"
                    type="email"
                    autoComplete="email"
                    disabled={form.watch("sameAsBilling")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shipping_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <PhoneInputForm
                    id="shipping-phone"
                    name="shipping-phone"
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
            name="shipping_zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="shipping-zip-code"
                    name="shipping-zip-code"
                    placeholder="Enter zip code"
                    autoComplete="postal-code"
                    disabled={form.watch("sameAsBilling")}
                  />
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
                  <Input
                    value={field.value}
                    id="shipping-country"
                    name="shipping-country"
                    readOnly
                    className="bg-muted"
                    autoComplete="country"
                  />
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
              name="shipping_province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input
                      value={stateFullName}
                      id="shipping-province"
                      name="shipping-province"
                      readOnly
                      className="bg-muted"
                      autoComplete="address-level1"
                    />
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
                  <Input
                    {...field}
                    id="shipping-city"
                    name="shipping-city"
                    placeholder="Enter city"
                    autoComplete="address-level2"
                    disabled={form.watch("sameAsBilling")}
                  />
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
              <FormLabel>Street address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="shipping-address"
                  name="shipping-address"
                  placeholder="12345 street"
                  autoComplete="street-address"
                  disabled={form.watch("sameAsBilling")}
                />
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
