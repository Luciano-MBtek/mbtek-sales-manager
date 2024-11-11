import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";

interface ProductReviewCardProps {
  products: Product[];
}

export default function ProductReviewCard({
  products,
}: ProductReviewCardProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Selected Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No products selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Selected Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id} className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {product.quantity} | Price: $
                  {product.price.toFixed(2)}
                </p>
              </div>
              <div className="text-sm font-medium">
                ${(product.price * product.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <p className="text-lg font-semibold">
            Total: $
            {products
              .reduce(
                (total, product) => total + product.price * product.quantity,
                0
              )
              .toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
