import { DealCard } from "./DealCard";
import { DealWithLineItems } from "@/types/dealTypes";

interface DealCardContainerProps {
  deals: DealWithLineItems[];
}

export const DealCardContainer = ({ deals }: DealCardContainerProps) => {
  if (!deals || deals.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No deals found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
};
