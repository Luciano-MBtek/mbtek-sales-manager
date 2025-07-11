import { useState, useTransition } from "react";
import { searchContacts } from "@/actions/searchContactsByName";
import { useToast } from "@/components/ui/use-toast";
import { Contact } from "@/types";

export function useContactSearch() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[] | number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleContactsSearch = (searchValue: string) => {
    setError(null);
    setContact(null);
    startTransition(async () => {
      try {
        let result;

        if (searchValue) {
          result = await searchContacts(searchValue);
        }

        setContacts(result ?? null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        } else {
          setError("An unknown error occurred");
          toast({
            title: "Error",
            description: "An unknown error occurred",
            variant: "destructive",
          });
        }
      }
    });
  };

  return {
    contact,
    contacts,
    isPending,
    error,
    handleContactsSearch,
  };
}
