"use client";

import SubmitButton from "@/components/SubmitButton";
import { FormErrors } from "@/types";
import FormQuestion from "@/components/FormQuestion";
import { cn } from "@/lib/utils";
import { useActionState, useEffect, useState } from "react";
import { stepThreeFormAction } from "./actions";
import { CompleteSystem, useSystemStore } from "@/store/completeSystem-store";
import Input from "@/components/Input";
import ZoneDataInput from "@/components/StepForm/ZoneDataInput";
import { zoneDataType } from "@/schemas/completeSystemSchema";

const initialState: FormErrors = {};

export default function StepThreeForm() {
  const [serverErrors, formAction] = useActionState(
    stepThreeFormAction,
    initialState
  );
  const { completeSystem, update } = useSystemStore();
  const [zonesData, setZonesData] = useState<zoneDataType[]>([]);

  useEffect(() => {
    if (completeSystem?.buildings_involved_data && zonesData.length === 0) {
      setZonesData(completeSystem.buildings_involved_data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeSystem?.buildings_involved_data]);

  if (!completeSystem?.buildings_involved_data && zonesData.length === 0) {
    return <div>Cargando datos...</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const adjustedValue =
      name === "ammount_of_zones" && Number(value) > 50 ? "50" : value;
    update({ ...completeSystem, [name]: adjustedValue } as CompleteSystem);
  };

  const handleZoneDataChange = (index: number, data: any) => {
    setZonesData((prevZones) => {
      const newZones = [...prevZones];
      newZones[index] = {
        zone_name: data.zone_name || "",
        sqft: data.sqft || 0,
        selected_option: data.selected_option || "",
      };
      return newZones;
    });
    update({
      ...(completeSystem ?? {}),
      buildings_involved_data: zonesData,
    } as CompleteSystem);
  };

  return (
    <form
      action={formAction}
      className={cn(
        "flex flex-1 flex-col items-center p-4",
        Object.keys(serverErrors || {}).length > 0
          ? "border-2 border-red-500 bg-red-50 rounded"
          : " bg-white  "
      )}
    >
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        <FormQuestion question="Let's calculate your needs a bit more deeper: Tell me more about the building(s) you will connect to your system" />
        <Input
          label="Ammount of zones connected to the system:"
          id="ammount_of_zones"
          type="number"
          min={0}
          max={50}
          errorMsg={serverErrors?.ammount_of_zones as string}
          onChange={handleInputChange}
          value={completeSystem?.ammount_of_zones || 0}
          className="w-full"
        />
        {serverErrors?.buildings_involved_data &&
          typeof serverErrors.buildings_involved_data === "string" && (
            <p className="text-sm text-red-500">
              {serverErrors.buildings_involved_data}
            </p>
          )}
        {Array.from({
          length: Number(completeSystem?.ammount_of_zones || 0),
        }).map((_, index) => (
          <ZoneDataInput
            key={index}
            index={index}
            value={zonesData[index]}
            onChange={handleZoneDataChange}
            errors={
              serverErrors?.buildings_involved_data?.[index] as {
                zone_name?: string;
                sqft?: string;
                selected_option?: string;
              }
            }
          />
        ))}

        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
