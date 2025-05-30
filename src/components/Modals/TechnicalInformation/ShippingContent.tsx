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
import React, { useEffect } from "react";

const deliveryTypes = [
  { value: "delivery", label: "Delivery" },
  { value: "pickup", label: "Pickup" },
  // ...otros tipos
];

const dropoffConditions = [
  { value: "dock", label: "Dock" },
  { value: "curbside", label: "Curbside" },
  // ...otras condiciones
];

const stateOptions = [
  { value: "NY", label: "New York" },
  { value: "CA", label: "California" },
  // ...otros estados
];

const countryOptions = [
  { value: "USA", label: "United States" },
  { value: "Canada", label: "Canada" },
  // ...otros países
];

interface ShippingFormValues {
  deliveryType: string;
  dropoffCondition: string;
  sameAsBilling: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

interface ShippingContentProps {
  onComplete: (data: ShippingFormValues) => void;
  initialData?: Partial<ShippingFormValues>;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function ShippingContent({
  onComplete,
  initialData = {},
  formRef,
}: ShippingContentProps) {
  const form = useForm<ShippingFormValues>({
    defaultValues: {
      deliveryType: initialData.deliveryType || "",
      dropoffCondition: initialData.dropoffCondition || "",
      sameAsBilling: initialData.sameAsBilling || false,
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      street: initialData.street || "",
      city: initialData.city || "",
      state: initialData.state || "",
      country: initialData.country || "",
    },
  });

  // Si el usuario marca "Same as billing", copiar los datos de facturación si están disponibles
  useEffect(() => {
    if (form.watch("sameAsBilling")) {
      // Aquí deberías obtener los datos de facturación del contexto o props si están disponibles
      // Por ahora, solo se deja el hook preparado
    }
  }, [form.watch("sameAsBilling")]);

  const handleSubmit = async (data: ShippingFormValues) => {
    await onComplete(data);
  };

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
            name="deliveryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
            name="dropoffCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dropoff location condition</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name*</FormLabel>
                <FormControl>
                  <Input {...field} disabled={form.watch("sameAsBilling")} />
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
                <FormLabel>Last Name*</FormLabel>
                <FormControl>
                  <Input {...field} disabled={form.watch("sameAsBilling")} />
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
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    disabled={form.watch("sameAsBilling")}
                  />
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
                <FormLabel>Phone*</FormLabel>
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
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="12345 street"
                    disabled={form.watch("sameAsBilling")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="City"
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
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={form.watch("sameAsBilling")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stateOptions.map((option) => (
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={form.watch("sameAsBilling")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryOptions.map((option) => (
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
        <div className="text-sm text-gray-500">* Required fields</div>
      </form>
    </Form>
  );
}
