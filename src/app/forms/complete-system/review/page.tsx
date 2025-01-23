import { Metadata } from "next";
import ReviewForm from "./ReviewFormCompleteSystem";

export const metadata: Metadata = {
  title: "Review",
  description: "Review all data",
};

export default function ReviewFormCompleteSystem() {
  return (
    <div>
      <ReviewForm />
    </div>
  );
}
