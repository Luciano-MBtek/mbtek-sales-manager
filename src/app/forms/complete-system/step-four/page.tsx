import { Metadata } from "next";
import StepFourForm from "./stepFourForm";

export const metadata: Metadata = {
  title: "Step four",
  description: "Complete System - Step four.",
};

export default function StepFour() {
  return (
    <div>
      <StepFourForm />
    </div>
  );
}
