"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Mail, Building2 } from "lucide-react";

import { useContactSearch } from "@/hooks/useContactSearch";
import { Input } from "@/components/ui/input";
import { Contact } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function getInitials(first?: string, last?: string) {
  return (
    `${first?.[0]?.toUpperCase() ?? ""}${last?.[0]?.toUpperCase() ?? ""}` || "?"
  );
}

const statusMap: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  IN_PROGRESS:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  OPEN_DISCOVERY:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  OPEN_DEAL:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Not sales related":
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  "Unable to Contact":
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Disqualified: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function getContactStatus(contact: Contact) {
  const status = (contact.properties.hs_lead_status ??
    "default") as keyof typeof statusMap;
  return {
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    className: statusMap[status],
  };
}

export function SearchInput() {
  const [searchValue, setSearchValue] = useState("");
  const { contacts, isPending, handleContactsSearch } = useContactSearch() as {
    contacts: Contact[] | number | null;
    isPending: boolean;
    handleContactsSearch: (searchValue: string) => void;
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);

  useEffect(() => {
    if (!searchValue.trim()) return;

    const timeout = setTimeout(() => {
      handleContactsSearch(searchValue);
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // Show dropdown when contacts are loaded
  useEffect(() => {
    if (
      contacts &&
      Array.isArray(contacts) &&
      contacts.length > 0 &&
      searchValue.trim()
    ) {
      setShowDropdown(true);
    }
  }, [contacts, searchValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!contacts || !Array.isArray(contacts)) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusIdx((i) => Math.min(i + 1, contacts.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusIdx((i) => Math.max(i - 1, -1));
        break;
      case "Enter":
        if (focusIdx >= 0) {
          e.preventDefault();
          // Handle selection if needed
          setShowDropdown(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        break;
    }
  };

  // Cast contacts to the appropriate type
  const contactsArray =
    contacts && Array.isArray(contacts) ? (contacts as Contact[]) : [];

  return (
    <div className="relative w-[400px]">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>
        <Input
          type="text"
          placeholder="Search contacts..."
          className="w-full h-11 pl-10 pr-4 bg-background/50  border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setFocusIdx(-1);
            if (!e.target.value.trim()) {
              setShowDropdown(false);
            }
          }}
          onFocus={() => searchValue.trim() && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>
      {showDropdown && searchValue.trim() && (
        <div
          className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-border/50 bg-popover/95 backdrop-blur-md shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
          role="listbox"
        >
          <div className="max-h-80 overflow-y-auto">
            {isPending && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isPending && contacts === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No contacts found
              </p>
            )}

            {!isPending && contactsArray.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border/50">
                  Contacts ({contactsArray.length})
                </div>
                {contactsArray.map((c, i) => {
                  const isActive = i === focusIdx;
                  const status = getContactStatus(c);
                  return (
                    <Link
                      href={`/contacts/${c.id}?name=${c.properties.firstname}&lastname=${c.properties.lastname}`}
                      key={c.id}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 cursor-pointer border-l-2 transition-colors",
                          isActive
                            ? "bg-accent/80 border-l-primary"
                            : "hover:bg-accent/50 border-l-transparent"
                        )}
                        onMouseEnter={() => setFocusIdx(i)}
                      >
                        <Avatar className="h-10 w-10 ring-2 ring-background">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.properties.firstname} ${c.properties.lastname}`}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(
                              c.properties.firstname,
                              c.properties.lastname
                            )}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {c.properties.firstname} {c.properties.lastname}
                            </p>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs px-2 py-0.5",
                                status.className
                              )}
                            >
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            {c.properties.email && (
                              <span className="flex items-center gap-1 max-w-[150px]">
                                <Mail className="h-3 w-3" />{" "}
                                {c.properties.email}
                              </span>
                            )}
                            {c.properties.company && (
                              <span className="flex items-center gap-1 truncate max-w-[120px]">
                                <Building2 className="h-3 w-3" />{" "}
                                {c.properties.company}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
