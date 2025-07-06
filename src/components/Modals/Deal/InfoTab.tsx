"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Deal } from "@/types/dealTypes";
import {
  getDealStageLabel,
  getPipelineLabel,
} from "@/app/mydeals/utils";

interface InfoTabProps {
  deal: Deal;
}

const InfoTab = ({ deal }: InfoTabProps) => {
  const { dealname, amount, dealstage, pipeline, createdate, closedate } =
    deal.properties;
  const pipelineLabel = getPipelineLabel(pipeline || "");
  const isCompleteSystem = pipelineLabel === "Mbtek - Complete System";
  const isInstantQuote = pipelineLabel === "Mbtek - Instant Quote";

  const formatCurrency = (value: number | string | undefined) => {
    if (!value) return "$0.00";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString() : "Not set";

  return (
    <TabsContent value="deal-info" className="mt-4">
      <div className="grid grid-cols-2 gap-4 min-h-[200px]">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Name</span>
          <span className="text-sm font-medium">{dealname || "N/A"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-sm font-medium">
            {formatCurrency(amount)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Stage</span>
          <span className="text-sm font-medium">
            {getDealStageLabel(dealstage || "")}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Pipeline</span>
          <span className="text-sm font-medium">
            {getPipelineLabel(pipeline || "")}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Created</span>
          <span className="text-sm font-medium">{formatDate(createdate)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Close Date</span>
          <span className="text-sm font-medium">{formatDate(closedate)}</span>
        </div>

        {isCompleteSystem && (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Year Built</span>
              <span className="text-sm font-medium">
                {deal.properties.year_of_construction || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Insulation</span>
              <span className="text-sm font-medium">
                {deal.properties.insulation_type || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Installation</span>
              <span className="text-sm font-medium">
                {deal.properties.installation_responsible || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Specific Needs</span>
              <span className="text-sm font-medium">
                {deal.properties.specific_needs
                  ? deal.properties.specific_needs.split(";").join(", ")
                  : "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Zones</span>
              <span className="text-sm font-medium">
                {deal.properties.number_of_zones || "N/A"}
              </span>
            </div>
          </>
        )}

        {isInstantQuote && (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Billing Email</span>
              <span className="text-sm font-medium">
                {deal.properties.billing_email || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Billing Phone</span>
              <span className="text-sm font-medium">
                {deal.properties.billing_phone || "N/A"}
              </span>
            </div>
          </>
        )}
      </div>
    </TabsContent>
  );
};

export default InfoTab;

