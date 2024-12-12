import { Metadata } from "next";
import StepOneForm from "./stepOneForm";

export const metadata: Metadata = {
  title: "Step one",
  description: "Discovery Call - Step one.",
};

export default function StepOne() {
  return (
    <div>
      <StepOneForm />
    </div>
  );
}
