import { getAllDealsDataWithLineItems } from "@/actions/getDealsData";
import PageHeader from "@/components/PageHeader";
import React from "react";
import { pipelineLabels } from "@/app/mydeals/utils";
import { getQuotesByDealIdBatch } from "@/actions/quote/getDealQuoteAssociations";
import { DealCardContainer } from "@/components/QuickQuote/DealCardContainer";

type Props = {
  params: Promise<{ id: string }>;
};

const QuickQuotePage = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const deals = await getAllDealsDataWithLineItems(id);

  const dealIds = deals.map((deal) => deal.id);
  const quotesMap = await getQuotesByDealIdBatch(dealIds);

  const quickQuotePipeline = pipelineLabels["Mbtek - Instant Quote"];

  const quickQuoteDeals = deals.filter(
    (deal) => deal.properties.pipeline === quickQuotePipeline
  );

  const hasQuickQuoteDeals = quickQuoteDeals.length > 0;

  return (
    <div className="flex flex-col w-full mt-[--header-height]">
      <PageHeader
        title="Quick quote creation"
        subtitle={
          hasQuickQuoteDeals
            ? "Select the deal to proceed"
            : "There are no quick deals for this contact."
        }
      />
      <div className="">
        {hasQuickQuoteDeals && (
          <DealCardContainer deals={quickQuoteDeals} quotesMap={quotesMap} />
        )}
      </div>
    </div>
  );
};

export default QuickQuotePage;
