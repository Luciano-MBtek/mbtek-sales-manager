import { Card, CardContent } from "@/components/ui/card";
import { Deal } from "./deals";
import {
  calculateDaysRemaining,
  calculateDealProgress,
  formatDate,
  getDealStageLabel,
  getInitials,
} from "./utils";
import { Calendar, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DealCardOptions } from "./components/DealCardOptions";

interface DealCardProps {
  deal: Deal;
  onSelect?: (id: string) => void;
}

export const DealCard = ({ deal, onSelect }: DealCardProps) => {
  const contact = deal.contacts[0];
  const dealPipeline = deal.properties.pipeline;

  const amount = Number.parseFloat(deal.properties.amount || "0");
  const progress = calculateDealProgress(
    deal.properties.createdate,
    deal.properties.closedate
  );

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-green-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleSelect = () => {
    onSelect?.(deal.id);
  };

  return (
    <Card
      className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
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
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm line-clamp-2">
                {deal.properties.dealname}
              </h4>
              <DealCardOptions
                contactId={contact.id}
                dealId={deal.id}
                dealPipeline={dealPipeline}
              />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="font-semibold text-green-600">
                {formatCurrency(amount)}
              </span>
            </div>
          </div>

          {contact && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getInitials(contact.firstname, contact.lastname)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">
                {contact.firstname} {contact.lastname}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Expires: {formatDate(deal.properties.closedate)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs"></div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-accent">
              <div
                className={`h-full w-full flex-1 transition-all ${getProgressColor(progress)}`}
                style={{
                  transform: `translateX(-${100 - progress}%)`,
                }}
              />
            </div>
            {/* Day Remaining here */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Days remaining:</span>
              <span className="text-xs font-medium">
                {calculateDaysRemaining(deal.properties.closedate)} days
              </span>
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            {getDealStageLabel(deal.properties.dealstage)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
