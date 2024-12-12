import { Metadata } from "next";
import StepFourForm from "./stepFourForm";

export const metadata: Metadata = {
  title: "Step four",
  description: "Discovery Call - Step four.",
};

export default function StepFour() {
  return (
    <div>
      <StepFourForm />
    </div>
  );
}
