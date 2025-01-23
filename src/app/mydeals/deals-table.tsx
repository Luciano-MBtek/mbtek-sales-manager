"use client";
import { Deal } from "@/app/mydeals/deals";
import { getDealStageColor, getDealStageLabel } from "./utils";
import { useEffect, useState } from "react";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DealsTableProps {
  deals: Deal[];
}

const DealsTable = ({ deals }: DealsTableProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const totalPages = Math.ceil(deals.length / itemsPerPage);

  const filteredDeals = deals.filter((deal) => {
    const dealName = deal.properties.dealname.toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    // Primero verificamos si coincide el nombre del deal
    if (dealName.includes(searchLower)) {
      return true;
    }

    // Luego verificamos el nombre del contacto solo si existe
    if (deal.contacts && deal.contacts.length > 0) {
      const contactName =
        `${deal.contacts[0].firstname} ${deal.contacts[0].lastname}`.toLowerCase();
      return contactName.includes(searchLower);
    }

    return false;
  });
  const paginatedDeals = filteredDeals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search Deals..."
          value={searchQuery}
          type="text"
          className="max-w-sm"
          onChange={(e) => setSearchQuery(e.target.value)}
        ></Input>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Deal Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Create Date</TableHead>
            <TableHead>Deal Stage</TableHead>
            <TableHead>Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedDeals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.properties.dealname}</TableCell>
              <TableCell>
                {deal.contacts && deal.contacts.length > 0 ? (
                  <>
                    {deal.contacts.map((contact) => (
                      <div key={contact.id}>
                        {contact.firstname} {contact.lastname}
                      </div>
                    ))}
                  </>
                ) : (
                  <>No contacts assigned</>
                )}
              </TableCell>
              <TableCell>
                ${parseFloat(deal.properties.amount).toFixed(2)}
              </TableCell>
              <TableCell>
                {new Date(deal.properties.createdate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getDealStageColor(getDealStageLabel(deal.properties.dealstage))}`}
                >
                  {getDealStageLabel(deal.properties.dealstage)}
                </span>
              </TableCell>
              <TableCell>
                {deal.contacts && deal.contacts.length > 0 ? (
                  <Button
                    onClick={() =>
                      router.push(`/contacts/${deal.contacts[0].id}`)
                    }
                  >
                    View Contact
                  </Button>
                ) : (
                  <Button disabled>No Contact</Button>
                )}
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
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
                className="cursor-pointer"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DealsTable;
