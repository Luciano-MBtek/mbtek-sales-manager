import StepThreeFormB2B from "./stepThreeFormB2B";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step three - B2B",
  description: "Discovery Call - Step three.",
};

export default function StepThree() {
  return (
    <div>
      <StepThreeFormB2B />
    </div>
  );
}
