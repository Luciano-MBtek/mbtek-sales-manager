import { getAllProducts } from "@/actions/getAllProducts";
import StepSingleProductTwoForm from "./stepTwoForm";

export default async function StepTwo() {
  const products = await getAllProducts();

  console.log(products);
  return (
    <div className="flex flex-col items-center">
      <StepSingleProductTwoForm />
    </div>
  );
}
