import PageHeader from "@/components/PageHeader";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const CompleteSystemDealPage = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  return (
    <div className="flex flex-col w-full mt-[--header-height]">
      <PageHeader
        title="Complete System - Quote creation"
        subtitle="Create the quote for the deal"
      />
    </div>
  );
};

export default CompleteSystemDealPage;
