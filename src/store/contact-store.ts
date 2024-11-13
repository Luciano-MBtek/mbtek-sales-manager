import { create } from "zustand";
import { persist } from "zustand/middleware";

type Contact = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  leadStatus: string;
  country: string;
  state?: string;
  province?: string;
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
