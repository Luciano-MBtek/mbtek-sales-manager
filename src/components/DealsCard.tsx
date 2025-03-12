import DealCard from "@/components/DealCard";
import { DealWithLineItems } from "@/types/dealTypes";

interface DealsCardProps {
  deals: DealWithLineItems[];
}

const DealsCard = ({ deals }: DealsCardProps) => {
  return (
    <div className="flex items-center w-full mt-2">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
};

export default DealsCard;
