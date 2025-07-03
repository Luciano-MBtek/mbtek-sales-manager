import { DealCard } from "./DealCard";
import { DealWithLineItems } from "@/types/dealTypes";

interface DealCardContainerProps {
  deals: DealWithLineItems[];
  quotesMap: Map<string, string[]>;
}

export const DealCardContainer = ({
  deals,
  quotesMap,
}: DealCardContainerProps) => {
  if (!deals || deals.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No deals found.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          hasQuote={
            quotesMap.has(deal.id) && quotesMap.get(deal.id)!.length > 0
          }
        />
      ))}
    </div>
  );
};
