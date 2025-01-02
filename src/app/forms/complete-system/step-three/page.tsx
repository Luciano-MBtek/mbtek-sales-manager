import { Metadata } from "next";
import StepThreeForm from "./stepThreeForm";

export const metadata: Metadata = {
  title: "Step three",
  description: "Complete System - Step three.",
};

export default function StepThree() {
  return (
    <div>
      <StepThreeForm />
    </div>
  );
}
