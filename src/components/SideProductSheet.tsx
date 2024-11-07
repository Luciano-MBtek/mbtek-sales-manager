import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/actions/getAllProducts";
import { Product } from "@/types";

interface SideProductSheetProps {
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
}

export function SideProductSheet({
  selectedProducts,
  setSelectedProducts,
}: SideProductSheetProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [localSelectedProducts, setLocalSelectedProducts] =
    useState<Product[]>(selectedProducts);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 8;

  const { isLoading, data } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const allProducts = await getAllProducts();
      return allProducts;
    },
  });

  useEffect(() => {
    setLocalSelectedProducts(selectedProducts);
  }, [selectedProducts]);

  useEffect(() => {
    if (data && "data" in data) {
      const mappedProducts = data.data.map((product: any) => ({
        id: product.id,
        name: product.properties.name || "",
        sku: product.properties.hs_sku || "",
        image: product.properties.hs_images || "",
        price: parseFloat(product.properties.price) || 0,
        selected: false,
      }));
      setProducts(mappedProducts);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();
    return (
      (product.name || "").toLowerCase().includes(searchTerm) ||
      (product.sku || "").toLowerCase().includes(searchTerm) ||
      product.price.toString().includes(searchTerm)
    );
  });

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

  const toggleProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const isCurrentlySelected = localSelectedProducts.some(
        (p) => p.id === productId
      );
      if (!isCurrentlySelected) {
        setLocalSelectedProducts((prev) => [...prev, product]);
      } else {
        setLocalSelectedProducts(
          localSelectedProducts.filter((p) => p.id !== productId)
        );
      }
    }
  };

  return (
    <div className="w-full m-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Add Products</Button>
        </SheetTrigger>
        <SheetContent
          style={{ maxWidth: "min(95vw, 800px)", width: "100%" }}
          className="overflow-y-auto flex flex-col sm:w-full "
        >
          <SheetHeader>
            <SheetTitle>Hubspot Products</SheetTitle>
            <SheetDescription>
              Search and select products to add.
            </SheetDescription>
          </SheetHeader>
          <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
            {/* Search Field */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search the product library by name, SKU or price"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Products Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">PRICE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4}>Loading...</TableCell>
                    </TableRow>
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox
                            checked={localSelectedProducts.some(
                              (p) => p.id === product.id
                            )}
                            onCheckedChange={() => toggleProduct(product.id)}
                          />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className="text-right">
                          ${product.price.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>No products found</TableCell>
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

          {/* Action Buttons */}
          <SheetFooter>
            <div className="flex justify-start gap-2">
              <SheetClose asChild>
                <Button
                  onClick={() => {
                    setSelectedProducts(localSelectedProducts);
                  }}
                >
                  Add
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLocalSelectedProducts(selectedProducts);
                  }}
                >
                  Cancel
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
