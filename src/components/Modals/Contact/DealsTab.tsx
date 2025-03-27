import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { getAllDealsDataWithLineItems } from "@/actions/getDealsData";
import { DealWithLineItems } from "@/types/dealTypes";
import { Loader2, Package } from "lucide-react";
import {
  getDealStageColor,
  getDealStageLabel,
  getPipelineLabel,
} from "@/app/mydeals/utils";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DealsTabProps {
  contactId: string;
}

const formatCurrency = (amount: string | number | undefined) => {
  if (!amount) return "$0.00";
  const numAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numAmount);
};

const DealsTab = ({ contactId }: DealsTabProps) => {
  const [deals, setDeals] = useState<DealWithLineItems[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dealsData = await getAllDealsDataWithLineItems(contactId);
        setDeals(dealsData);
      } catch (err) {
        console.error("Error fetching deals:", err);
        setError("Failed to load deals information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [contactId]);

  return (
    <TabsContent value="deals" className="mt-6">
      {isLoading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading deals...
          </span>
        </div>
      ) : error ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Card className="w-full border-destructive">
            <CardContent className="pt-6 text-center text-destructive">
              <p>{error}</p>
            </CardContent>
          </Card>
        </div>
      ) : deals.length > 0 ? (
        <ScrollArea className="h-[390px] pr-2">
          <div className="space-y-4">
            {deals.map((deal) => (
              <Card key={deal.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">
                      {deal.properties.dealname}
                    </CardTitle>
                    <Badge
                      className={cn(
                        "ml-2",
                        getDealStageColor(deal.properties.dealstage || "")
                      )}
                    >
                      {getDealStageLabel(deal.properties.dealstage)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col  gap-2">
                      <span className="text-sm text-muted-foreground">
                        Pipeline:
                      </span>
                      <span className="text-sm font-medium">
                        {getPipelineLabel(deal.properties.pipeline || "")}
                      </span>
                    </div>

                    <div className="flex flex-col  gap-2">
                      <span className="text-sm text-muted-foreground">
                        Close Date:
                      </span>
                      <span className="text-sm font-medium">
                        {deal.properties.closedate
                          ? new Date(
                              deal.properties.closedate
                            ).toLocaleDateString()
                          : "Not set"}
                      </span>
                    </div>

                    <div className="flex flex-col  gap-2">
                      <span className="text-sm text-muted-foreground">
                        Amount:
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(deal.properties.amount)}
                      </span>
                    </div>
                  </div>

                  {deal.lineItems && deal.lineItems.length > 0 && (
                    <div className="mt-4">
                      <div className="bg-muted/80 rounded-md p-3">
                        {deal.lineItems && deal.lineItems.length > 0 && (
                          <div className="mt-4">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem
                                value="line-items"
                                className="border-none"
                              >
                                <AccordionTrigger className="py-2 px-3 bg-muted/50 rounded-t-md hover:no-underline">
                                  <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <h4 className="text-sm font-medium">
                                      Line Items
                                    </h4>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                  <div className="bg-muted/50 rounded-b-md p-3 pt-0">
                                    <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground mb-2 mt-2">
                                      <div className="col-span-6">Item</div>
                                      <div className="col-span-2 text-right">
                                        Qty
                                      </div>
                                      <div className="col-span-2 text-right">
                                        Price
                                      </div>
                                      <div className="col-span-2 text-right">
                                        Total
                                      </div>
                                    </div>

                                    <Separator className="mb-2" />

                                    {deal.lineItems.map((item, index) => (
                                      <div
                                        key={item.id}
                                        className="grid grid-cols-12 gap-4 text-sm py-1.5"
                                      >
                                        <div className="col-span-6 font-medium">
                                          {item.properties.name}
                                        </div>
                                        <div className="col-span-2 text-right">
                                          {item.properties.quantity}
                                        </div>
                                        <div className="col-span-2 text-right">
                                          {formatCurrency(
                                            Number(item.properties.price)
                                          )}
                                        </div>
                                        <div className="col-span-2 text-right font-medium">
                                          {formatCurrency(
                                            Number.parseFloat(
                                              item.properties.quantity || "0"
                                            ) *
                                              Number.parseFloat(
                                                item.properties.price || "0"
                                              )
                                          )}
                                        </div>
                                        {index < deal.lineItems.length - 1 && (
                                          <div className="col-span-12 mt-1.5">
                                            <Separator className="opacity-50" />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-muted/30 pt-3 pb-3 flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Deal ID: {deal.id}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Total:</span>
                    <span className="font-semibold">
                      {formatCurrency(deal.properties.amount)}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
          <Package className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
          <p className="text-muted-foreground">
            No deals found for this contact
          </p>
        </div>
      )}
    </TabsContent>
  );
};

export default DealsTab;
