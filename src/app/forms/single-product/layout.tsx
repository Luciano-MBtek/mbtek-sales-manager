import React from "react";
import PageHeader from "@/components/PageHeader";
import StepNavigation from "@/components/StepNavigation";
import { singleProductRoutes } from "@/types";
import { SingleProductContextProvider } from "@/contexts/singleProductContext";

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
];
export default function SingleProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-2 lg:px-0">
      <PageHeader
        title="Single Product - Quote Generator"
        subtitle="Form process to generate a single product Quote."
      />

      <div className="mt-5 mb-28 flex flex-col gap-x-16 text-white lg:flex-row">
        <StepNavigation steps={steps} />
        <SingleProductContextProvider>
          <div className="w-full">{children}</div>
        </SingleProductContextProvider>
      </div>
    </div>
  );
}
