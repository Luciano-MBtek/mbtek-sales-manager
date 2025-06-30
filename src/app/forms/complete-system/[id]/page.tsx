import { getAllDealsDataWithLineItems } from "@/actions/getDealsData";
import PageHeader from "@/components/PageHeader";
import React from "react";
import { pipelineLabels } from "@/app/mydeals/utils";
import { DealCardContainer } from "@/components/CompleteSystem/DealCardContainer";

type Props = {
  params: Promise<{ id: string }>;
};

const CompleteSystemPage = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const deals = await getAllDealsDataWithLineItems(id);

  const completeSystemPipeline = pipelineLabels["Mbtek - Complete System"];

  const completeSystemDeals = deals.filter(
    (deal) => deal.properties.pipeline === completeSystemPipeline
  );

  const hasCompleteSystem = completeSystemDeals.length > 0;

  return (
    <div className="flex flex-col w-full mt-[--header-height]">
      <PageHeader
        title="Complete System - Quote creation"
        subtitle={
          hasCompleteSystem
            ? "Select the deal to proceed"
            : "There are no complete system deals for this contact."
        }
      />
      <div className="">
        {hasCompleteSystem && <DealCardContainer deals={completeSystemDeals} />}
      </div>
    </div>
  );
};

export default CompleteSystemPage;
