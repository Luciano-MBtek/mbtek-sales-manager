"use client";

import { Card } from "@/components/ui/card";
import Input from "@/components/Input";
import { zoneOptionsValues } from "@/schemas/completeSystemSchema";

interface ZoneDataInputProps {
  index: number;
  onChange: (index: number, data: any) => void;
  value?: any;
  errors?: {
    zone_name?: string;
    sqft?: string;
    selected_option?: string;
  };
}

export default function ZoneDataInput({
  index,
  onChange,
  value,
  errors,
}: ZoneDataInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue, type } = e.target;

    const validatedValue =
      type === "number" && Number(inputValue) > 27000 ? "27000" : inputValue;

    const fieldName = name === `zone_${index}` ? "zone_name" : "sqft";
    onChange(index, {
      ...(value || {}),
      [fieldName]: validatedValue,
    });
  };

  const handleOptionSelect = (option: string) => {
    onChange(index, {
      ...(value || {}),
      selected_option: option,
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <Input
        label={`Zone ${index + 1} Name`}
        id={`zone_${index}`}
        type="text"
        placeholder="Enter zone name here"
        value={value?.zone_name || ""}
        onChange={handleInputChange}
        errorMsg={errors?.zone_name}
      />

      <Input
        label="Square Footage"
        id={`sqft_${index}`}
        type="number"
        placeholder="Sqft"
        value={value?.sqft || 0}
        onChange={handleInputChange}
        errorMsg={errors?.sqft}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Available Options:</p>
        {errors?.selected_option && (
          <p className="text-sm text-red-500">{errors.selected_option}</p>
        )}
        <input
          type="hidden"
          name={`selected_option_${index}`}
          value={value?.selected_option || ""}
        />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {zoneOptionsValues.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionSelect(option)}
              className={`p-2 text-sm rounded-md border transition-colors ${
                value?.selected_option === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
