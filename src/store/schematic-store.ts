import { ClientFileData } from "@/schemas/schematicRequestSchema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SchematicRequest = {
  total_area: string;
  number_zones: string;
  square_feet_zone: string;
  heat_elements: string[];
  special_application?: "DHW" | "Pool" | "None";
  extra_notes?: string;
  documentation?: ClientFileData;
};

interface SchematicStore {
  schematic: SchematicRequest | null;
  update: (data: Partial<SchematicRequest>) => void;
  clear: () => void;
}

export const useSchematicStore = create(
  persist<SchematicStore>(
    (set) => ({
      schematic: null,
      update: (data) =>
        set((state) => ({
          schematic: state.schematic
            ? { ...state.schematic, ...data }
            : ({ ...data } as SchematicRequest),
        })),
      clear: () => set(() => ({ schematic: null })),
    }),
    {
      name: "schematic-storage",
    }
  )
);
