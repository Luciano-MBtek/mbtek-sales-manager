import PageHeader from "@/components/PageHeader";
import StepNavigation from "@/components/StepNavigation";

import { completeSystemRoutes } from "@/types";
import { title } from "process";

const steps = [
  {
    title: "Step One",
    route: "step-one",
    link: completeSystemRoutes.GENERAL_SYSTEM_DATA,
  },
  {
    title: "Step Two",
    route: "step-two",
    link: completeSystemRoutes.MARKET_DATA,
  },
  {
    title: "Step Three",
    route: "step-three",
    link: completeSystemRoutes.BUILDING_DATA,
  },
  {
    title: "Step Four",
    route: "step-four",
    link: completeSystemRoutes.PROJECT_PLANS,
  },
  {
    title: "Step Five",
    route: "step-five",
    link: completeSystemRoutes.SHIPPING_DATA,
  },
  {
    title: "Step Six",
    route: "step-six",
    link: completeSystemRoutes.BOOKING_DATA,
  },
  {
    title: "Review",
    route: "review",
    link: completeSystemRoutes.REVIEW_COMPLETE_SYSTEM,
  },
];

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-2 lg:px-0 mt-2">
      <PageHeader
        title="Complete System - Data Collection"
        subtitle="Form process to collect lead's information for complete system."
      />
      <div className="mt-1 mb-28 flex flex-col gap-x-16 text-white lg:flex-row">
        <StepNavigation steps={steps} />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
