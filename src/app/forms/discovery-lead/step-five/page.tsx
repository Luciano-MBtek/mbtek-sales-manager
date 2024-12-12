import { Metadata } from "next";
import StepFiveForm from "./StepFiveForm";

export const metadata: Metadata = {
  title: "Qualification",
  description: "Discovery Call - Step five.",
};

export default function StepFour() {
  return (
    <div>
      <StepFiveForm />
    </div>
  );
}
