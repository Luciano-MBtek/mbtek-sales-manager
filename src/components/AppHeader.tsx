"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { useContactSearch } from "@/hooks/useContactSearch";
import { Input } from "@/components/ui/input";

export function AppHeader() {
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState("");
  const { contacts, isPending, handleContactsSearch } = useContactSearch();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!searchValue.trim()) return;

    const timeout = setTimeout(() => {
      handleContactsSearch(searchValue);
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const title =
    session?.user?.accessLevel === "sales_agent" ||
    session?.user?.accessLevel === "manager"
      ? "Sales Closer Dashboard"
      : "Lead Qualification Dashboard";

  return (
    <header className="flex items-center justify-between w-full border-b bg-background px-4 py-2">
      <div className="flex items-center gap-3">
        <Image src="/Logo_Vector.png" alt="Logo" width={120} height={40} />
        <h1 className="text-lg font-semibold whitespace-nowrap">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search contacts..."
            className="w-56"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          {showDropdown && searchValue.trim() && (
            <div className="absolute left-0 right-0 z-10 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
              {isPending && (
                <div className="px-4 py-2 text-sm">Searching...</div>
              )}
              {!isPending && contacts === 0 && (
                <div className="px-4 py-2 text-sm">No results</div>
              )}
              {!isPending && Array.isArray(contacts) &&
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="px-4 py-2 text-sm hover:bg-accent"
                  >
                    {contact.properties.firstname} {contact.properties.lastname}
                    {" - "}
                    {contact.properties.email}
                  </div>
                ))}
            </div>
          )}
        </div>
        <button type="button" className="p-2">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
      </div>
    </header>
  );
}
