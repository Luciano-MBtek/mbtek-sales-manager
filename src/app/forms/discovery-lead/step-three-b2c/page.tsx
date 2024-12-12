import StepThreeForm from "./stepThreeForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step three - B2C",
  description: "Discovery Call - Step three.",
};

export default function StepThree() {
  return (
    <div className="p-4">
      <StepThreeForm />
    </div>
  );
}
