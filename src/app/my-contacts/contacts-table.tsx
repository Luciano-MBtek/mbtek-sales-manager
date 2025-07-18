"use client";
import { OwnedContacts } from "@/app/my-contacts/myContacts";
import { useCallback, useEffect, useState } from "react";
import {
  getPageNumbers,
  calculateDaysSinceCreation,
  formatDate,
} from "./utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  getContactsByOwnerId,
  searchContactsByTerm,
} from "@/actions/searchOwnedContacts";
import { ContactModal } from "@/components/Modals/Contact/ContactModal";
import { SearchIcon, Loader2 } from "lucide-react";

interface DealsTableProps {
  contacts: OwnedContacts[];
  initialTotal: number;
  after: string;
  hubspotId?: string;
}

const OwnedContactsTable = ({
  contacts: initialContacts,
  initialTotal,
  after: initialAfter,
  hubspotId,
}: DealsTableProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("");
  const [contacts, setContacts] = useState(initialContacts);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(contacts.length < initialTotal);
  const [currentAfter, setCurrentAfter] = useState(initialAfter);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );

  const handleOpenModal = (contact: OwnedContacts) => {
    setSelectedContactId(contact.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContactId(null);
  };

  const loadMoreContacts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newData = await getContactsByOwnerId(currentAfter, hubspotId);

      if (newData.results.length > 0) {
        setContacts((prev) => [...prev, ...newData.results]);

        setCurrentAfter(newData.paging.next.after);
        setHasMore(newData.results.length === 25);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more contacts:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [currentAfter, isLoading, hasMore, hubspotId]);

  // Search server-side if search is longer than 2 characters
  const searchContacts = useCallback(
    async (term: string) => {
      if (!term || term.length < 2) return;

      setIsSearching(true);
      try {
        const searchResults = await searchContactsByTerm(term, hubspotId);
        if (searchResults.results) {
          setContacts(searchResults.results);
          // Reset pagination since we're showing search results
          setCurrentPage(1);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error searching contacts:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [hubspotId]
  );

  // Reset to original data when search is cleared
  const resetContactList = useCallback(async () => {
    setIsLoading(true);
    try {
      const initialData = await getContactsByOwnerId(undefined, hubspotId);
      setContacts(initialData.results);
      setCurrentAfter(initialData.paging?.next?.after || 0);
      setHasMore(initialData.results.length < initialData.total);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error resetting contacts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [hubspotId]);

  // Handle search with debounce for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQueryDebounced(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle search effect
  useEffect(() => {
    if (searchQueryDebounced) {
      searchContacts(searchQueryDebounced);
    } else if (searchQueryDebounced === "") {
      resetContactList();
    }
  }, [searchQueryDebounced, searchContacts, resetContactList]);

  // For local filtering when results are already loaded
  const filteredContacts = contacts.filter((contact) => {
    // If we're already using server-side search, skip client filtering
    if (searchQueryDebounced.length >= 2) return true;

    const searchLower = searchQuery.toLowerCase().trim();

    if (!searchLower) return true;

    const firstname = String(contact.properties.firstname || "").toLowerCase();
    const lastname = String(contact.properties.lastname || "").toLowerCase();
    const email = String(contact.properties.email || "").toLowerCase();
    const company = String(contact.properties.company || "").toLowerCase();
    const phone = String(contact.properties.phone || "").toLowerCase();

    const isMatch =
      firstname.includes(searchLower) ||
      lastname.includes(searchLower) ||
      email.includes(searchLower) ||
      company.includes(searchLower) ||
      phone.includes(searchLower);

    return isMatch;
  });

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage === totalPages && hasMore && !searchQueryDebounced) {
      loadMoreContacts();
    }
  }, [
    currentPage,
    totalPages,
    hasMore,
    loadMoreContacts,
    searchQueryDebounced,
  ]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 relative">
        <Input
          placeholder="Search Contacts..."
          value={searchQuery}
          type="text"
          className="max-w-sm pr-10"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 ml-4 text-gray-500">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon className="h-4 w-4" />
          )}
        </div>
        {searchQuery && (
          <div className="ml-4 text-sm text-gray-500">
            Found {filteredContacts.length} results
          </div>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Client Type</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedContacts.length > 0 ? (
            paginatedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(contact)}
                >
                  {`${contact.properties.firstname || ""} ${contact.properties.lastname || ""}`.trim() ||
                    "-"}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(contact)}
                >
                  {contact.properties.company || "-"}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(contact)}
                >
                  <div className="flex flex-col">
                    <span>{contact.properties.phone || "-"}</span>
                    <span className="text-xs text-gray-500">
                      {contact.properties.email || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(contact)}
                >
                  {contact.properties.lead_type || "-"}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(contact)}
                >
                  {contact.properties.lastmodifieddate
                    ? formatDate(contact.properties.lastmodifieddate)
                    : "-"}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(contact)}
                >
                  {contact.properties.total_revenue
                    ? `$${parseFloat(contact.properties.total_revenue).toFixed(2)}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => router.push(`/contacts/${contact.id}`)}
                  >
                    View Contact
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Searching...
                  </div>
                ) : (
                  "No contacts found"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginatedContacts.length > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers(currentPage, totalPages).map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`
                  cursor-pointer
                  ${
                    (currentPage === totalPages && !hasMore) || isLoading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  ${isLoading ? "animate-pulse" : ""}
                `}
              >
                {isLoading ? "Loading..." : "Next"}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <ContactModal
        contactId={selectedContactId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default OwnedContactsTable;
