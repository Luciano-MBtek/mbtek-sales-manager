import StepSingleProductTwoForm from "./stepTwoForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step two",
  description: "Single Product form step two.",
};

export default async function StepTwo() {
  return (
    <div className="flex flex-col items-center">
      <StepSingleProductTwoForm />
    </div>
  );
}
