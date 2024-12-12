"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LineItemCard from "@/components/LineItemCard";
import { DealWithLineItems } from "@/types/dealTypes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DealCardProps {
  deal: DealWithLineItems;
}

export default function DealCard({ deal }: DealCardProps) {
  const { dealname, createdate, hs_lastmodifieddate, pipeline } =
    deal.properties;

  const [isOpen, setIsOpen] = useState(false);

  const totalDealAmmount = deal.lineItems.reduce((total, lineItem) => {
    const price = parseFloat(lineItem.properties.price) || 0;
    return total + price;
  }, 0);

  return (
    <Card className="mb-6 w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{dealname || "No Deal Name"}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">ID: {deal.id}</Badge>
          {pipeline && <Badge variant="secondary">{pipeline}</Badge>}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            className="bg-success text-success-foreground"
            variant="outline"
          >
            Total ammount: ${totalDealAmmount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="font-semibold">Creation Date:</p>
            <p>{new Date(createdate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Last Modified:</p>
            <p>{new Date(hs_lastmodifieddate).toLocaleDateString()}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Items:</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle line items</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent
            className={cn(
              "text-popover-foreground outline-none",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[state=open]:slide-in-from-top-2",
              "data-[state=closed]:slide-out-to-top-2"
            )}
          >
            {deal.lineItems.length > 0 ? (
              <div className="space-y-4 mt-4">
                {deal.lineItems.map((lineItem) => (
                  <LineItemCard key={lineItem.id} lineItem={lineItem} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-4">
                There are no line items associated with this deal.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
