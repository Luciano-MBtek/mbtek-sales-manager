import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/actions/getAllProducts";
import { Product } from "@/types";
import { ProductsTable } from "@/components/ProductsTable";

interface SideProductSheetProps {
  selectedProducts: (Product & { isMain: boolean })[];
  setSelectedProducts: (products: (Product & { isMain: boolean })[]) => void;
}

interface APIProduct {
  id: string;
  properties: {
    name: string;
    hs_sku: string;
    hs_images: string;
    price: number;
  };
}

export function SideProductSheet({
  selectedProducts,
  setSelectedProducts,
}: SideProductSheetProps) {
  const [products, setProducts] = useState<(Product & { isMain: boolean })[]>(
    []
  );
  const [localSelectedProducts, setLocalSelectedProducts] =
    useState<(Product & { isMain: boolean })[]>(selectedProducts);

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
      const mappedProducts = data.data.map((product: APIProduct) => ({
        id: product.id,
        name: product.properties.name || "",
        sku: product.properties.hs_sku || "",
        image: product.properties.hs_images || "",
        price: Number(product.properties.price) || 0,
        quantity: 1,
        unitDiscount: 0,
        selected: false,
        isMain: false,
      }));
      setProducts(mappedProducts);
    }
  }, [data]);

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

          <ProductsTable
            products={products}
            isLoading={isLoading}
            selectedProducts={localSelectedProducts}
            onProductToggle={toggleProduct}
          />

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
