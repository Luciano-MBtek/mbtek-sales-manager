import { getQuoteFullDetail } from "@/actions/quote/getQuoteFullDetail";
import { DealCard } from "./DealCard";
import { DealWithLineItems } from "@/types/dealTypes";

interface DealCardContainerProps {
  deals: DealWithLineItems[];
  quotesMap: Map<string, string[]>;
}

export const DealCardContainer = async ({
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

  // Preparar un objeto para almacenar los detalles de las quotes
  const quotesDetails: Record<string, any> = {};

  // Obtener los detalles de cada quote asociada a los deals
  for (const deal of deals) {
    if (quotesMap.has(deal.id) && quotesMap.get(deal.id)!.length > 0) {
      const quoteId = quotesMap.get(deal.id)![0];
      if (quoteId) {
        // Obtener detalles solo si aún no han sido cargados
        if (!quotesDetails[quoteId]) {
          try {
            const quoteDetail = await getQuoteFullDetail(quoteId);
            quotesDetails[quoteId] = quoteDetail;
          } catch (error) {
            console.error(
              `Error fetching quote ${quoteId} for deal ${deal.id}:`,
              error
            );
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      {deals.map((deal) => {
        const hasQuote =
          quotesMap.has(deal.id) && quotesMap.get(deal.id)!.length > 0;
        const quoteId = hasQuote ? quotesMap.get(deal.id)![0] : null;
        const quoteDetails = quoteId ? quotesDetails[quoteId] : null;

        return (
          <DealCard
            key={deal.id}
            deal={deal}
            hasQuote={hasQuote}
            quoteDetails={quoteDetails}
          />
        );
      })}
    </div>
  );
};
