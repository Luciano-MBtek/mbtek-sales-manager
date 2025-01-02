import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CompleteSystemType } from "@/schemas/completeSystemSchema";

export type CompleteSystem = CompleteSystemType;

interface SystemStore {
  completeSystem: CompleteSystem | null;
  update: (completeSystem: CompleteSystem) => void;
  clear: () => void;
}

export const useSystemStore = create(
  persist<SystemStore>(
    (set) => ({
      completeSystem: null,
      update: (completeSystem) => set(() => ({ completeSystem })),
      clear: () => set(() => ({ completeSystem: null })),
    }),
    {
      name: "complete-system-storage",
    }
  )
);
