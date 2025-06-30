"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineItem } from "@/types/dealTypes";
import { DollarSign, Package, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface LineItemCardProps {
  lineItem: LineItem;
}

export default function LineItemCard({ lineItem }: LineItemCardProps) {
  const { name, price, quantity, hs_images, hs_product_id, createdate } =
    lineItem.properties;

  const totalPrice = parseFloat(price) * (parseInt(quantity) || 1);

  return (
    <Card className="border border-border hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden">
              <Image
                src={hs_images || "/placeholder.svg"}
                alt={name}
                className="object-cover"
                fill
                sizes="80px"
              />
            </div>
            <div>
              <h4 className="font-medium text-sm line-clamp-1">{name}</h4>
              <Badge variant="outline" className="text-xs mt-1">
                ID: {hs_product_id}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="font-semibold text-green-600 text-xs">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">Qty: {quantity}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Added:{" "}
              {new Date(createdate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
