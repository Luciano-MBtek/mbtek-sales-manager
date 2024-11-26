import ReviewFormSingleProduct from "./ReviewFormSingleProduct";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review",
  description: "Single Product review.",
};

export default function ReviewForm() {
  return (
    <div>
      <ReviewFormSingleProduct />
    </div>
  );
}
