import PageHeader from "@/components/PageHeader";
import StepNavigation from "@/components/StepNavigation";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
  children: React.ReactNode;
};

export default async function DealsLayout({ children, params }: Props) {
  const { id, dealId } = await params;

  const steps = [
    {
      title: "Building needs",
      route: "step-one",
      link: `/deals/complete-system/${id}/deal/${dealId}/step-one`,
    },
    {
      title: "Zones Info",
      route: "step-two",
      link: `/deals/complete-system/${id}/deal/${dealId}/step-two`,
    },
    {
      title: "Documents",
      route: "step-three",
      link: `/deals/complete-system/${id}/deal/${dealId}/step-three`,
    },
    {
      title: "Billing",
      route: "step-four",
      link: `/deals/complete-system/${id}/deal/${dealId}/step-four`,
    },
    {
      title: "Shipping",
      route: "step-five",
      link: `/deals/complete-system/${id}/deal/${dealId}/step-five`,
    },

    {
      title: "Meeting",
      route: "meeting",
      link: `/deals/complete-system/${id}/deal/${dealId}/meeting`,
    },
  ];

  return (
    <div className="w-full px-2 lg:px-0 mt-[--header-height]">
      <PageHeader
        title="Complete System - Info Collection"
        subtitle={`Collecting technical information for deal ID: ${dealId}`}
      />
      <div className="mt-1 mb-28 flex flex-col gap-x-16 text-primary lg:flex-row">
        <StepNavigation steps={steps} />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
