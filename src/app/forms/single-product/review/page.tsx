import { Suspense } from "react";
import ReviewFormSingleProduct from "./ReviewFormSingleProduct";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review",
  description: "Standard Quote review.",
};

export const maxDuration = 60;

export default function ReviewForm() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewFormSingleProduct />
      </Suspense>
    </div>
  );
}
