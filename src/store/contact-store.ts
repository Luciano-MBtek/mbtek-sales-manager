import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Contact = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  leadStatus: string;
  phone: string;
  country: string;
  state?: string;
  province?: string;
  city: string;
  zip: string;
  address: string;
  areDeals: boolean;
  hasSchematic: boolean;
  hasQuotes: boolean;
  wantsCompleteSystem: boolean;
};

interface ContactStore {
  contact: Contact | null;
  update: (contact: Contact) => void;
  clear: () => void;
}

export const useContactStore = create(
  persist<ContactStore>(
    (set) => ({
      contact: null,
      update: (contact) => set(() => ({ contact })),
      clear: () => set(() => ({ contact: null })),
    }),
    {
      name: "contact-storage",
    }
  )
);
