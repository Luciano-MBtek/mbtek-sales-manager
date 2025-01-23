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
import { Trash2, Minus, Plus } from "lucide-react";
import { Input } from "./ui/input";

interface ProductCardProps {
  selectedProducts: Product[];
  totalPrice: number;
  serverErrors?: {
    products?: string;
  };
  onRemoveProduct: (productId: string) => void;
  handleQuantity: (productId: string, string: string) => void;
  handleDiscount: (productId: string, discount: number) => void;
}

export default function ProductCard({
  selectedProducts,
  totalPrice,
  serverErrors,
  onRemoveProduct,
  handleQuantity,
  handleDiscount,
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
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Discount</th>
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
                    <td className="py-2 px-4 text-sm text-black">
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleQuantity(product.id, "decrease")}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center">
                          {product.quantity}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleQuantity(product.id, "increase")}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex justify-center items-center">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="%"
                          className="w-12 p-1 border rounded"
                          value={product.unitDiscount || 0}
                          onChange={(e) =>
                            handleDiscount(product.id, Number(e.target.value))
                          }
                        />
                        %
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right font-semibold">
                      <div className="max-w-[100px] ml-auto">
                        $
                        {(
                          (product.price *
                            (100 - (product.unitDiscount || 0))) /
                          100
                        ).toFixed(2)}
                      </div>
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
