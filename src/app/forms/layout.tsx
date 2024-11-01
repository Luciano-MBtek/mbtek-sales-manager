import React from "react";
import PageHeader from "@/components/PageHeader";
import StepNavigation from "@/components/StepNavigation";
import { AddLeadContextProvider } from "@/contexts/addDealContext";

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

      <div className="mt-5 mb-28 flex flex-col gap-x-16 text-white lg:flex-row">
        <StepNavigation />
        <AddLeadContextProvider>
          <div className="w-full">{children}</div>
        </AddLeadContextProvider>
      </div>
    </div>
  );
}
