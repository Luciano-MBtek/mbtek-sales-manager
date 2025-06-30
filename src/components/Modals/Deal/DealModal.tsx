"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Deal } from "@/types/dealTypes";
import { getDealById } from "@/actions/deals/getDealsById";
import InfoTab from "./InfoTab";
import LineItemsTab from "./LineItemsTab";
import EngagementsTab from "./EngagementsTab";

interface DealModalProps {
  dealId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DealModal({ dealId, isOpen, onClose }: DealModalProps) {
  const [activeTab, setActiveTab] = useState("deal-info");
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!dealId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDealById(dealId, true);
        setDeal(data as Deal);
      } catch (err) {
        console.error("Error fetching deal:", err);
        setError("Failed to load deal information");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && dealId) {
      fetchDeal();
    }
  }, [dealId, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto"
      >
        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-2">
            <DialogTitle className="text-xl font-semibold">
              Loading deal data...
            </DialogTitle>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="min-h-[400px] flex items-center justify-center text-destructive">
            {error}
          </div>
        ) : deal ? (
          <>
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {deal.properties.dealname}
              </DialogTitle>
              <span className="text-sm text-foreground">
                Created{" "}
                {new Date(deal.properties.createdate).toLocaleDateString()}
              </span>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full mt-2"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="deal-info">Deal Info</TabsTrigger>
                <TabsTrigger value="line-items">Line Items</TabsTrigger>
                <TabsTrigger value="engagements">Engagements</TabsTrigger>
              </TabsList>

              <InfoTab deal={deal} />
              <LineItemsTab dealId={deal.id} />
              <EngagementsTab dealId={deal.id} />
            </Tabs>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
            No deal information available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DealModal;
