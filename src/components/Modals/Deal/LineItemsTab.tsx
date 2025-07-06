"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { LineItem } from "@/types/dealTypes";

import { Loader2, Package } from "lucide-react";
import LineItemCard from "@/components/LineItemCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDealLineItems } from "@/actions/deals/getDealLineItems";

interface LineItemsTabProps {
  dealId: string;
}


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
          <span className="text-sm text-muted-foreground">
            Loading line items...
          </span>
        </div>
      ) : error ? (
        <div className="min-h-[200px] flex items-center justify-center text-destructive">
          {error}
        </div>
      ) : items.length > 0 ? (
        <ScrollArea className="h-[390px] pr-2">
          <div className="space-y-4">
            {items.map((item) => (
              <LineItemCard key={item.id} lineItem={item} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
          <Package className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
          <p className="text-muted-foreground">
            No line items found for this deal
          </p>
        </div>
      )}
    </TabsContent>
  );
};

export default LineItemsTab;
