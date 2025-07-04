import { getQuoteByDealId } from "@/actions/quote/getQuoteByDealId";
import PageHeader from "@/components/PageHeader";
import StepNavigation from "@/components/StepNavigation";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
  children: React.ReactNode;
};

export default async function DealsLayout({ children, params }: Props) {
  const { id, dealId } = await params;

  const quoteAssociated = await getQuoteByDealId(dealId);

  const hasQuote = quoteAssociated.length > 0;

  const steps = [
    {
      title: "Add products",
      route: "step-one",
      link: `/deals/complete-system/${id}/quote/${dealId}/step-one`,
    },
    {
      title: "Review data",
      route: "step-two",
      link: `/deals/complete-system/${id}/quote/${dealId}/step-two`,
    },
  ];

  return (
    <div className="w-full px-2 lg:px-0 mt-[--header-height]">
      <PageHeader
        title={`Complete System - Quote ${hasQuote ? "update" : "creation"}`}
        subtitle={`${hasQuote ? "Updating" : "Creating"} quote for deal ID: ${dealId}`}
      />
      <div className="mt-1 mb-28 flex flex-col gap-x-2 text-primary lg:flex-row">
        <StepNavigation steps={steps} />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
