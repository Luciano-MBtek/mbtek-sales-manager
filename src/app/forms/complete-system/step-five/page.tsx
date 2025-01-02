import { Metadata } from "next";
import StepFiveForm from "./stepFiveForm";

export const metadata: Metadata = {
  title: "Step five",
  description: "Complete System - Step five.",
};

export default function StepFive() {
  return (
    <div>
      <StepFiveForm />
    </div>
  );
}
