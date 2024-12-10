import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineItem } from "@/types/dealTypes";

interface LineItemCardProps {
  lineItem: LineItem;
}

export default function LineItemCard({ lineItem }: LineItemCardProps) {
  const { name, price, quantity, hs_images, hs_product_id, createdate } =
    lineItem.properties;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <div className="relative">
          <Image
            src={hs_images || "/placeholder.svg"}
            alt={name}
            className="object-cover rounded-md"
            width={150}
            height={150}
          />
        </div>
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="secondary" className="mt-1">
            ID: {hs_product_id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-semibold">Price:</p>
            <p>${parseFloat(price).toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Quantity:</p>
            <p>{quantity}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">Creation Date:</p>
            <p>{new Date(createdate).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
