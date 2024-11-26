import { Metadata } from "next";
import ReviewForm from "./ReviewFormNewLead";

export const metadata: Metadata = {
  title: "Review",
  description: "Review all data",
};

export default function ReviewFormNewLead() {
  return (
    <div>
      <ReviewForm />
    </div>
  );
}
