import React from "react";
import PageHeader from "@/components/PageHeader";
import StepNavigation from "@/components/StepNavigation";
import { singleProductRoutes } from "@/types";
import { SingleProductContextProvider } from "@/contexts/singleProductContext";
import { Quote } from "lucide-react";

const steps = [
  {
    title: "Step One",
    route: "step-one",
    link: singleProductRoutes.SHIPPING_DATA,
  },
  {
    title: "Step Two",
    route: "step-two",
    link: singleProductRoutes.PRODUCT_DATA,
  },
  {
    title: "Review",
    route: "review",
    link: singleProductRoutes.REVIEW_SINGLE_PRODUCT,
  },
];
export default function SingleProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-2 lg:px-0 mt-[--header-height]">
      <PageHeader
        title="Standard Quote creation"
        subtitle="Fill the form to generate a standard Quote."
        icon={Quote}
      />

      <div className="mt-1 mb-28 flex flex-col gap-x-2  lg:flex-row">
        <StepNavigation steps={steps} />
        <SingleProductContextProvider>
          <div className="w-full">{children}</div>
        </SingleProductContextProvider>
      </div>
    </div>
  );
}
