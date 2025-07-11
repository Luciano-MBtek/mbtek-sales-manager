"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

// Validation schema
const buildingNeedsSchema = z
  .object({
    yearOfConstruction: z.number().min(1, "Year of construction is required"),
    insulationType: z.string().min(1, "Insulation type is required"),
    specificNeeds: z
      .array(z.string())
      .min(1, "At least one specific need is required"),
    otherSpecificNeed: z.string().optional(),
    isOtherSelected: z.boolean().default(false),
    installationResponsible: z
      .string()
      .min(1, "Installation responsible is required"),
  })
  .refine(
    (data) => {
      if (data.isOtherSelected) {
        return (data.otherSpecificNeed ?? "").trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify the other need",
      path: ["otherSpecificNeed"],
    }
  );

type BuildingNeedsFormValues = z.infer<typeof buildingNeedsSchema>;

// Options for insulation type
const insulationTypes = [
  { value: "poorly_insulated", label: "Poorly insulated" },
  { value: "regular_insulation", label: "Regular insulation" },
  { value: "highly_insulated", label: "Highly insulated" },
  { value: "unknown", label: "Unknown" },
];

// Options for specific needs
const specificNeedsOptions = [
  { id: "heating", label: "Heating" },
  { id: "domestic_hot_water", label: "Domestic hot water" },
  { id: "spa_heating", label: "Spa Heating" },
  { id: "house_dehumidification", label: "House dehumidification" },
  { id: "air_conditioning", label: "Air conditioning" },
  { id: "pool_heating", label: "Pool Heating" },
  { id: "air_purification_erv", label: "Air Purification (ERV)" },
];

// Options for installation responsible
const installationResponsibleOptions = [
  { value: "owner_diy", label: "Owner (DIY)" },
  { value: "have_its_own_installer", label: "Have its own installer" },
  {
    value: "requires_an_installer_provided_by_us",
    label: "Requires an installer provided by us",
  },
];

interface BuildingNeedsContentProps {
  onComplete: (data: BuildingNeedsFormValues) => void;
  initialData?: Partial<BuildingNeedsFormValues>;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function BuildingNeedsContent({
  onComplete,
  initialData = {},
  formRef,
}: BuildingNeedsContentProps) {
  const form = useForm<BuildingNeedsFormValues>({
    resolver: zodResolver(buildingNeedsSchema),
    defaultValues: {
      yearOfConstruction: Number(initialData.yearOfConstruction) || 0,
      insulationType: initialData.insulationType || "",
      specificNeeds: initialData.specificNeeds || [],
      otherSpecificNeed: initialData.otherSpecificNeed || "",
      isOtherSelected: Boolean(initialData.otherSpecificNeed),
      installationResponsible: initialData.installationResponsible || "",
    },
  });

  const handleSubmit = async (data: BuildingNeedsFormValues) => {
    await onComplete(data);
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Year of construction */}
          <FormField
            control={form.control}
            name="yearOfConstruction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of construction *</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Insulation type */}
          <FormField
            control={form.control}
            name="insulationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insulation type *</FormLabel>
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
                    {insulationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Specific needs */}
        <FormField
          control={form.control}
          name="specificNeeds"
          render={() => (
            <FormItem>
              <FormLabel>
                Specific needs/Special application * (multiple selection)
              </FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {specificNeedsOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="specificNeeds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                return checked
                                  ? field.onChange([...currentValue, option.id])
                                  : field.onChange(
                                      currentValue.filter(
                                        (value) => value !== option.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}

                {/* Other specific need */}
                <FormField
                  control={form.control}
                  name="isOtherSelected"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked) {
                              form.setValue("otherSpecificNeed", "");
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Other</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherSpecificNeed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Input
                          placeholder="Specify other need"
                          {...field}
                          disabled={!form.watch("isOtherSelected")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Installation responsible */}
        <FormField
          control={form.control}
          name="installationResponsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Installation responsible *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {installationResponsibleOptions.map((option) => (
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

        <div className="text-sm text-gray-500">* Required fields</div>
      </form>
    </Form>
  );
}
