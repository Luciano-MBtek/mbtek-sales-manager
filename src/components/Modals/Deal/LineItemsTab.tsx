"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { LineItem } from "@/types/dealTypes";
import { getDealLineItems } from "@/actions/getDealLineItems";
import { Loader2, Package } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LineItemsTabProps {
  dealId: string;
}

const formatCurrency = (value: string | number | undefined) => {
  if (!value) return "$0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
};

const LineItemsTab = ({ dealId }: LineItemsTabProps) => {
  const [items, setItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDealLineItems(dealId);
        setItems(data);
      } catch (err) {
        console.error("Error fetching line items:", err);
        setError("Failed to load line items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [dealId]);

  return (
    <TabsContent value="line-items" className="mt-4">
      {loading ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading line items...</span>
        </div>
      ) : error ? (
        <div className="min-h-[200px] flex items-center justify-center text-destructive">
          {error}
        </div>
      ) : items.length > 0 ? (
        <ScrollArea className="h-[390px] pr-2">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{item.properties.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Qty:</span> {item.properties.quantity}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span> {formatCurrency(item.properties.price)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span> {formatCurrency(parseFloat(item.properties.price) * parseFloat(item.properties.quantity))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-2 flex justify-between">
                  <span className="text-xs text-muted-foreground">ID: {item.id}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
          <Package className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
          <p className="text-muted-foreground">No line items found for this deal</p>
        </div>
      )}
    </TabsContent>
  );
};

export default LineItemsTab;

