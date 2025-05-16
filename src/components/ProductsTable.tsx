import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useChatStore } from "@/store/chatbot-store";
import { useSession } from "next-auth/react";
import { sendChatbotMessage } from "./ChatBot/chatbot-service";

interface ProductsTableProps {
  products: (Product & { isMain: boolean })[];
  isLoading: boolean;
  selectedProducts?: (Product & { isMain: boolean })[];
  onProductToggle?: (productId: string) => void;
  searchPlaceholder?: string;
  showCheckboxes?: boolean;
}

export function ProductsTable({
  products,
  isLoading,
  selectedProducts = [],
  onProductToggle = () => {},
  searchPlaceholder = "Search the product library by name, SKU or price",
  showCheckboxes = true,
}: ProductsTableProps) {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 8;
  const { addMessage, setIsOpen, setIsLoading } = useChatStore();

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();
    return (
      (product.name || "").toLowerCase().includes(searchTerm) ||
      (product.sku || "").toLowerCase().includes(searchTerm) ||
      product.price.toString().includes(searchTerm)
    );
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) {
    displayedPages.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCheckStock = async (sku: string) => {
    const message = `Please check out the stock for this product: ${sku}`;

    setIsOpen(true);

    await sendChatbotMessage(message, session?.user?.hubspotOwnerId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Search Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {showCheckboxes && <TableHead className="w-12"></TableHead>}
              <TableHead>NAME</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">PRICE</TableHead>
              {!showCheckboxes && (
                <TableHead className="text-center">ACTIONS</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={showCheckboxes ? 4 : 4}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <TableRow key={product.id}>
                  {showCheckboxes && (
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.some(
                          (p) => p.id === product.id
                        )}
                        onCheckedChange={() => onProductToggle(product.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell className="text-right">
                    ${product.price.toLocaleString()}
                  </TableCell>
                  {!showCheckboxes && (
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckStock(product.sku)}
                      >
                        Check Stock
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showCheckboxes ? 4 : 4}>
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
            />
          </PaginationItem>
          {displayedPages.map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href="#"
                isActive={number === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(number);
                }}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
