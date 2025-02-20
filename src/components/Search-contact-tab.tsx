"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NoContactCard from "./NoContactCard";
import { ContactList } from "./ContactList";
import { useContactSearch } from "@/hooks/useContactSearch";
import { useSingleProductContext } from "@/contexts/singleProductContext";

export function SearchContactTab() {
  const [searchValue, setSearchValue] = useState("");
  const { resetLocalStorage } = useSingleProductContext();
  const { contacts, isPending, handleContactsSearch } = useContactSearch();

  useEffect(() => {
    resetLocalStorage();
  }, [resetLocalStorage]);

  useEffect(() => {
    if (!searchValue.trim()) return;

    const debounceTimeout = setTimeout(() => {
      handleContactsSearch(searchValue);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleContactsSearch(searchValue);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <Card>
        <CardHeader>
          <CardTitle>Search contacts</CardTitle>
          <CardDescription>
            Search contacts from Hubspot by name, email, or phone number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter name, email or phone..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => handleContactsSearch(searchValue)}
            disabled={isPending || !searchValue}
          >
            {isPending ? "Searching..." : "Search"}
          </Button>
        </CardFooter>
      </Card>

      {contacts === 0 ? (
        <NoContactCard value="contact" />
      ) : (
        contacts && (
          <ContactList contacts={contacts} searchValue={searchValue} />
        )
      )}
    </div>
  );
}
