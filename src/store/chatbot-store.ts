import { create } from "zustand";

type Message = {
  text: string;
  isUser: boolean;
};

interface ChatStore {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setIsLoading: (loading: boolean) => void;
  setIsOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsOpen: (open) => set({ isOpen: open }),
}));
