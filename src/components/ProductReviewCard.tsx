import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import ConfirmBox from "./ConfirmBox";
import { Badge } from "./ui/badge";
import Shopify from "./Icons/Shopify";

interface ProductReviewCardProps {
  products: Product[];
  customShipment: number | undefined;
}

export default function ProductReviewCard({
  products,
  customShipment,
}: ProductReviewCardProps) {
  const subTotal = products.reduce(
    (total, product) =>
      total +
      product.price * product.quantity * (1 - product.unitDiscount / 100),
    0
  );

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
              <div className="relative overflow-hidden rounded">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={60}
                    height={60}
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

                <Badge
                  className="text-background"
                  variant={product.unitDiscount > 0 ? "success" : "default"}
                >
                  Discount: {product.unitDiscount}%
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  {product.isMain && <ConfirmBox text={"Main product"} />}
                </div>
                <div className="text-sm flex font-medium justify-end">
                  {product.unitDiscount > 0 ? (
                    <>
                      <span className="line-through text-muted-foreground mr-2">
                        ${(product.price * product.quantity).toFixed(2)}
                      </span>
                      $
                      {(
                        product.price *
                        product.quantity *
                        (1 - product.unitDiscount / 100)
                      ).toFixed(2)}
                    </>
                  ) : (
                    `$${(product.price * product.quantity).toFixed(2)}`
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex w-full flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <p className="text-md font-semibold">
              Shipment:{" "}
              {customShipment !== undefined
                ? `$${customShipment}`
                : "Defined by"}
            </p>
            <span>
              <Shopify width={24} height={24} />
            </span>
          </div>
          <p className="text-md font-semibold">
            Sub total: ${subTotal.toFixed(2)}
          </p>
          <p className="text-lg font-semibold">
            Total: $
            {customShipment !== undefined
              ? (Number(customShipment) + subTotal).toFixed(2)
              : subTotal.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
