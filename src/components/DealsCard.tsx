import DealCard from "@/components/DealCard";
import { DealWithLineItems } from "@/types/dealTypes";

interface DealsCardProps {
  deals: DealWithLineItems[];
}

const DealsCard = ({ deals }: DealsCardProps) => {
  // Ordenar los deals por fecha de creación, mostrando los más recientes primero
  const sortedDeals = [...deals].sort(
    (a, b) =>
      new Date(b.properties.createdate).getTime() -
      new Date(a.properties.createdate).getTime()
  );

  return (
    <div className="flex flex-col items-center w-full mt-2">
      {sortedDeals.map((deal, index) => (
        <DealCard key={deal.id} deal={deal} isMostRecent={index === 0} />
      ))}
    </div>
  );
};

export default DealsCard;
