"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Plus, Minus } from "lucide-react";
import React from "react";

const distributionSystems = [
  { value: "wall_fan_coil", label: "Wall Fan Coil (FCU)" },
  { value: "floor_fan_coil", label: "Floor Fan Coil (FCU)" },
  { value: "ceiling_fan_coil", label: "Ceiling Fan Coil (FCU)" },
  { value: "concealed_fan_coil", label: "Concealed Fan Coil (FCU)" },
  { value: "ahu", label: "Air Handling Unit (AHU)" },
  { value: "radiant_floor", label: "Radiant Floor" },
  { value: "wall_radiator", label: "Wall Radiator" },
];

const zoneSchema = z.object({
  name: z.string().min(1, "Zone name is required"),
  size: z
    .string()
    .min(1, "Zone size is required")
    .regex(/^\d+$/, "Must be a number"),
  distribution: z.string().min(1, "Distribution system is required"),
});

const zonesInformationSchema = z.object({
  numberOfZones: z
    .string()
    .min(1, "Number of zones is required")
    .regex(/^\d+$/, "Must be a number"),
  zones: z.array(zoneSchema).min(1, "At least one zone is required"),
});

type ZonesInformationFormValues = z.infer<typeof zonesInformationSchema>;

interface ZonesInformationContentProps {
  onComplete: (data: ZonesInformationFormValues) => void;
  initialData?: Partial<ZonesInformationFormValues>;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function ZonesInformationContent({
  onComplete,
  initialData = {},
  formRef,
}: ZonesInformationContentProps) {
  const form = useForm<ZonesInformationFormValues>({
    resolver: zodResolver(zonesInformationSchema),
    defaultValues: {
      numberOfZones: initialData.numberOfZones || "1",
      zones: initialData.zones || [{ name: "", size: "", distribution: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "zones",
  });

  React.useEffect(() => {
    const num = parseInt(form.watch("numberOfZones"), 10) || 1;
    if (fields.length < num) {
      for (let i = fields.length; i < num; i++) {
        append({ name: "", size: "", distribution: "" });
      }
    } else if (fields.length > num) {
      for (let i = fields.length; i > num; i--) {
        remove(i - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("numberOfZones")]);

  const handleAddZone = () => {
    append({ name: "", size: "", distribution: "" });
    form.setValue("numberOfZones", String(fields.length + 1));
  };

  const handleRemoveZone = (idx: number) => {
    if (fields.length > 1) {
      remove(idx);
      form.setValue("numberOfZones", String(fields.length - 1));
    }
  };

  const handleSubmit = async (data: ZonesInformationFormValues) => {
    await onComplete(data);
  };

  // Calcular área total
  const totalArea = form
    .watch("zones")
    ?.map((z) => parseInt(z.size || "0", 10))
    .reduce((a, b) => a + b, 0);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="numberOfZones"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of zones/main rooms *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <div className="text-gray-500 text-sm">Total floor area</div>
            <div className="text-3xl font-bold">{totalArea || 0} sq.ft</div>
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">Zone Configuration</div>
          <div className="grid grid-cols-12 gap-2 items-center font-semibold text-sm mb-2">
            <div className="col-span-4">Zone name</div>
            <div className="col-span-3">Zone size (sq.ft)</div>
            <div className="col-span-4">Distribution system</div>
            <div className="col-span-1"></div>
          </div>
          {fields.map((field, idx) => (
            <div
              className="grid grid-cols-12 gap-2 items-center mb-2"
              key={field.id}
            >
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name={`zones.${idx}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={`Zone ${idx + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name={`zones.${idx}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name={`zones.${idx}.distribution`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {distributionSystems.map((option) => (
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
              <div className="col-span-1 flex items-center">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveZone(idx)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mt-2"
            onClick={handleAddZone}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-500">* Required fields</div>
      </form>
    </Form>
  );
}
