import StepSingleProductOneForm from "./stepOneForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step one",
  description: "Standard Quote form step one.",
};

export default function StepOne() {
  return (
    <div className="flex flex-col items-center">
      <StepSingleProductOneForm />
    </div>
  );
}
