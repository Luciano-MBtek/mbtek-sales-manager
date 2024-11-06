import React from "react";
import PageHeader from "@/components/PageHeader";
import StepNavigation from "@/components/StepNavigation";
import { AddLeadContextProvider } from "@/contexts/addDealContext";
import { collectDataRoutes } from "@/types";

const steps = [
  {
    title: "Step One",
    route: "step-one",
    link: collectDataRoutes.DISCOVERY_CALL,
  },
  {
    title: "Step Two",
    route: "step-two",
    link: collectDataRoutes.DISCOVERY_CALL_2,
  },
  {
    title: "Step Three",
    route: ["step-three-b2c", "step-three-b2b"],
    routeType: "b2b" as const,
    links: {
      b2b: collectDataRoutes.LEAD_QUALIFICATION_B2B,
      b2c: collectDataRoutes.LEAD_QUALIFICATION_B2C,
    },
  },
  {
    title: "Step Four",
    route: "step-four",
    link: collectDataRoutes.LEAD_QUALIFICATION_B2C_2,
  },
  {
    title: "Review",
    route: "review",
    link: collectDataRoutes.REVIEW_LEAD,
  },
];

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-2 lg:px-0">
      <PageHeader
        title="Discovery Call - Lead Qualification"
        subtitle="Form process to collect lead's information."
      />

      <div className="mt-1 mb-28 flex flex-col gap-x-16 text-white lg:flex-row">
        <StepNavigation steps={steps} />
        <AddLeadContextProvider>
          <div className="w-full">{children}</div>
        </AddLeadContextProvider>
      </div>
    </div>
  );
}
