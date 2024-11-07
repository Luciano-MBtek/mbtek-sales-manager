import { Product } from "@/types";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProductCardProps {
  selectedProducts: Product[];
  totalPrice: number;
  serverErrors?: {
    products?: string;
  };
  onRemoveProduct: (productId: string) => void;
}

export default function ProductCard({
  selectedProducts,
  totalPrice,
  serverErrors,
  onRemoveProduct,
}: ProductCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Products</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedProducts && selectedProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Image</th>
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">SKU</th>
                  <th className="py-2 px-4 text-right">Price</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2 px-4">
                      {product.image && (
                        <Image
                          width={60}
                          height={60}
                          src={product.image}
                          alt={product.name}
                          className="rounded-md"
                        />
                      )}
                    </td>
                    <td className="py-2 px-4 font-semibold">{product.name}</td>
                    <td className="py-2 px-4 text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="py-2 px-4 text-right font-semibold">
                      ${product.price?.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveProduct(product.id)}
                      >
                        <Trash2 width={16} />
                        <span className="sr-only">Remove product</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">
            Please add at least one product.
          </p>
        )}

        {serverErrors?.products && (
          <p className="text-red-500 text-sm mt-2">{serverErrors.products}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end  pt-4">
        <p className="font-bold text-lg">
          Subtotal:{" "}
          <span className="text-primary">${totalPrice.toLocaleString()}</span>
        </p>
      </CardFooter>
    </Card>
  );
}
