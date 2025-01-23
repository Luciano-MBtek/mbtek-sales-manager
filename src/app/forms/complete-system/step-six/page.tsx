import { Metadata } from "next";
import StepSixForm from "./stepSixForm";

export const metadata: Metadata = {
  title: "Step six",
  description: "Complete System - Step six.",
};

export default function StepSix() {
  return (
    <div>
      <StepSixForm />
    </div>
  );
}
