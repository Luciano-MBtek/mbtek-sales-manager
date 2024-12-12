import { useState, useTransition } from "react";
import { searchContact } from "@/actions/searchContact";
import { searchContacts } from "@/actions/searchContactsByName";
import { useToast } from "@/components/ui/use-toast";

type PropertyType = "email" | "phone";

export function useContactSearch() {
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = (searchValue: string, propertyType: PropertyType) => {
    setError(null);
    setContacts(null);
    startTransition(async () => {
      try {
        const result = await searchContact(searchValue, propertyType);
        setContact(result);
        if (result) {
          toast({
            title: "Contact found",
            description: "The contact has been successfully found",
          });
        } else {
          toast({
            title: "No results",
            description: "No contacts found",
            variant: "destructive",
          });
        }
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

  const handleContactsSearch = (firstname: string, lastname: string) => {
    console.log("Handle:", firstname, lastname);
    setError(null);
    setContact(null);
    startTransition(async () => {
      try {
        let result;
        if (firstname && lastname) {
          result = await searchContacts(firstname, lastname);
        } else if (firstname) {
          result = await searchContacts(firstname);
        } else if (lastname) {
          result = await searchContacts(firstname, lastname);
        }
        setContacts(result);

        if (result && result.length > 0) {
          toast({
            title: "Contacts found",
            description: `${result.length} contacts found`,
          });
        } else {
          toast({
            title: "No results",
            description: "No contacts found",
            variant: "destructive",
          });
        }
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
    handleSearch,
    handleContactsSearch,
  };
}
