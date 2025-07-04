"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  calculateDaysRemaining,
  calculateDealProgress,
  formatDate,
  getDealStageLabel,
} from "@/app/mydeals/utils";
import { formatCurrency } from "@/lib/utils";
import { DealWithLineItems } from "@/types/dealTypes";
import { Separator } from "@/components/ui/separator";
import LineItemCard from "@/components/LineItemCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import QuoteDetailsCard from "../Quote/QuoteDetailsCard";

interface DealCardProps {
  deal: DealWithLineItems;
  hasQuote: boolean;
  quoteDetails?: any;
  onSelect?: (id: string) => void;
}

export const DealCard = ({
  deal,
  hasQuote,
  onSelect,
  quoteDetails,
}: DealCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const amount = Number.parseFloat(deal.properties.amount?.toString() || "0");
  const progress = calculateDealProgress(
    deal.properties.createdate,
    deal.properties.closedate
  );

  const hasLineItems = deal.lineItems && deal.lineItems.length > 0;

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-green-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleSelect = () => {
    onSelect?.(deal.id);
  };

  const handleCreateQuote = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event

    // Extract the contact ID from the pathname
    // Assuming pathname is like /forms/complete-system/[contactId]
    const pathParts = pathname.split("/");
    const contactId = pathParts[pathParts.length - 1];

    // Navigate to the deal page with both contact ID and deal ID, adding the createQuote=true parameter
    router.push(`/forms/quick-quote/${contactId}/quote/${deal.id}`);
  };

  const subTotal = deal.lineItems.reduce((total, lineItem) => {
    const price = parseFloat(lineItem.properties.price) || 0;
    return total + price;
  }, 0);

  return (
    <Card
      className="mb-3 hover:shadow-md transition-shadow cursor-pointer w-[70%]"
      onClick={handleSelect}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      <CardContent className="p-4">
        {quoteDetails && <QuoteDetailsCard quoteDetails={quoteDetails} />}
        <div className="space-y-3 w-full">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h4 className="font-medium text-sm line-clamp-2">
                  Deal: {deal.properties.dealname}
                </h4>
                <div>
                  {deal.properties.split_payment === "Yes" ? (
                    <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                      Split Payment: {deal.properties.split_payment}
                    </Badge>
                  ) : (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                      Single Payment
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <Button
                  className="bg-mbtek hover:bg-accent hover:text-mbtek"
                  onClick={handleCreateQuote}
                >
                  {hasQuote ? "Update Quote" : "Create Quote"}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-6 mt-2">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-600" />
                <span className="font-semibold text-green-600">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Expires: {formatDate(deal.properties.closedate)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 max-w-[300px]">
            <div className="flex justify-between text-xs"></div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-accent">
              <div
                className={`h-full w-full flex-1 transition-all ${getProgressColor(progress)}`}
                style={{
                  transform: `translateX(-${100 - progress}%)`,
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="text-xs">
                {getDealStageLabel(deal.properties.dealstage)}
              </Badge>

              <span className="text-xs font-medium">
                {calculateDaysRemaining(deal.properties.closedate)} days
              </span>
            </div>
          </div>

          <Separator className="my-2" />

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {deal.lineItems.length} Item
                {deal.lineItems.length > 1 ? "s" : ""}:
              </h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-6">
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
                "text-popover-foreground outline-none w-full",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[state=open]:slide-in-from-top-2",
                "data-[state=closed]:slide-out-to-top-2"
              )}
            >
              {hasLineItems ? (
                <div className="space-y-4 mt-4 w-full">
                  {deal.lineItems.map((lineItem) => (
                    <LineItemCard key={lineItem.id} lineItem={lineItem} />
                  ))}
                  <div className="flex w-full items-center justify-end gap-2">
                    <p className="text-md text-gray-500">Subtotal:</p>

                    <span className="font-bold text-sm text-green-600">
                      {formatCurrency(subTotal)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground mt-4 text-sm">
                  No line items for this deal.
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
