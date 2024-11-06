import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Product {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
}

export function SideProductSheet() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "APOLLO Whole Home Dehumidifier", price: 749 },
    {
      id: "2",
      name: "APOLLO BF - Stainless Buffer Tank - 175/250gal - BF250",
      price: 3449,
    },
    {
      id: "3",
      name: "APOLLO Wi-Fi Fan Coil Thermostat - 12 to 24VAC/DC",
      price: 212,
    },
    { id: "4", name: "APOLLO Ceiling Fan Coil FCU - 4 Ton", price: 1117 },
    {
      id: "5",
      name: 'Motorized Mixing Valve - 3/4" 2-ways / 12-24VAC/DC / ON/OFF',
      price: 284,
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProduct = (productId: string) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, selected: !product.selected }
          : product
      )
    );
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
            {/* Campo de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search the product library by name, description, SKU, or folder"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Tabla de productos */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead className="text-right">PRICE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={product.selected}
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-right">
                        ${product.price.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Botones de acción */}
          <SheetFooter>
            <div className="flex justify-start gap-2">
              <Button>Add</Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
