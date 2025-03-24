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
import { getContactsByOwnerId } from "@/actions/searchOwnedContacts";

interface DealsTableProps {
  contacts: OwnedContacts[];
  initialTotal: number;
  after: string;
}

const OwnedContactsTable = ({
  contacts: initialContacts,
  initialTotal,
  after: initialAfter,
}: DealsTableProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState(initialContacts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(contacts.length < initialTotal);
  const [currentAfter, setCurrentAfter] = useState(initialAfter);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  const loadMoreContacts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newData = await getContactsByOwnerId(currentAfter);

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
  }, [currentAfter, isLoading, hasMore]);

  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchQuery.toLowerCase().trim();

    if (!searchLower) return true;

    const firstname = String(contact.properties.firstname || "").toLowerCase();
    const lastname = String(contact.properties.lastname || "").toLowerCase();
    const email = String(contact.properties.email || "").toLowerCase();

    const isMatch =
      firstname.includes(searchLower) ||
      lastname.includes(searchLower) ||
      email.includes(searchLower);

    return isMatch;
  });
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage === totalPages && hasMore) {
      loadMoreContacts();
    }
  }, [currentPage, totalPages, hasMore, loadMoreContacts]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search Contacts..."
          value={searchQuery}
          type="text"
          className="max-w-sm"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        ></Input>
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
          {paginatedContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                {`${contact.properties.firstname || ""} ${contact.properties.lastname || ""}`.trim() ||
                  "-"}
              </TableCell>
              <TableCell>{contact.properties.company || "-"}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{contact.properties.phone || "-"}</span>
                  <span className="text-xs text-gray-500">
                    {contact.properties.email || "-"}
                  </span>
                </div>
              </TableCell>
              <TableCell>{contact.properties.lead_type || "-"}</TableCell>
              <TableCell>
                {contact.properties.lastmodifieddate
                  ? formatDate(contact.properties.lastmodifieddate)
                  : "-"}
              </TableCell>
              <TableCell>
                {contact.properties.total_revenue
                  ? `$${parseFloat(contact.properties.total_revenue).toFixed(2)}`
                  : "-"}
              </TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/contacts/${contact.id}`)}>
                  View Contact
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </div>
  );
};

export default OwnedContactsTable;
