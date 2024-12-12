import { Metadata } from "next";
import StepTwoForm from "./stepTwoForm";

export const metadata: Metadata = {
  title: "Step two",
  description: "Discovery Call - Step two.",
};

export default function StepTwo() {
  return (
    <div>
      <StepTwoForm />
    </div>
  );
}
