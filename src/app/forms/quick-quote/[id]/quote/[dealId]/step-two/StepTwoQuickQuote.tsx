"use client";

import { FormErrors, Product, YesOrNo } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SideProductSheet } from "@/components/SideProductSheet";
import { useActionState, useEffect, useState } from "react";
import RadioInput from "@/components/StepForm/RadioButtonStepForm";

import ProductCard from "@/components/ProductCard";
import ContactFormCard from "@/components/StepForm/ContactFormCard";
import { useContactStore } from "@/store/contact-store";
import MainProductSelect from "@/components/MainProductSelect";
import SelectInput from "@/components/StepForm/SelectStepForm";
import { stepTwoQuickQuoteAction } from "./actions";

const options = YesOrNo.map((option) => option);

type ProductWithIsMain = Product & {
  isMain: boolean;
  sku?: string;
};

const initialState: FormErrors = {};

type StepTwoQuickQuoteProps = {
  dealId: string;
  contactId: string;
  initialProducts: ProductWithIsMain[];
  purchaseOptions: Array<{ label: string; value: string }>;
  purchaseOptionId: string;
  mainProductSku?: string;
  splitPayment?: string;
};

export default function StepTwoQuickQuote({
  dealId,
  contactId,
  initialProducts = [],
  purchaseOptions = [],
  purchaseOptionId = "",
  mainProductSku = "",
  splitPayment = "",
}: StepTwoQuickQuoteProps) {
  const [serverErrors, formAction] = useActionState(
    stepTwoQuickQuoteAction,
    initialState
  );
  const [selectedProducts, setSelectedProducts] =
    useState<ProductWithIsMain[]>(initialProducts);
  const [splitPaymentValue, setSplitPayment] = useState<string>(
    splitPayment || ""
  );
  const [purchaseOptionIdValue, setPurchaseOptionId] = useState<string>(
    purchaseOptionId || ""
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const { contact } = useContactStore();

  useEffect(() => {
    const totalPrice = selectedProducts.reduce((acc, product) => {
      if (!product.id) return acc;
      const discountedPrice =
        (product.price * (100 - (product.unitDiscount || 0))) / 100;
      return acc + discountedPrice * product.quantity;
    }, 0);
    setTotalPrice(totalPrice);
  }, [selectedProducts]);

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prevProducts) => {
      const isRemovingMainProduct = prevProducts.some(
        (p) => p.id === productId && p.isMain
      );

      const filteredProducts = prevProducts.filter(
        (product) => product.id !== productId
      );

      if (isRemovingMainProduct && filteredProducts.length > 0) {
        return filteredProducts.map((product, index) => ({
          ...product,
          isMain: index === 0,
        }));
      }

      return filteredProducts;
    });
  };

  const handleQuantity = (productId: string, action: string) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          const newQuantity =
            action === "increase" ? product.quantity + 1 : product.quantity - 1;
          return { ...product, quantity: Math.max(newQuantity, 1) };
        }
        return product;
      })
    );
  };

  const handleMainProductSelect = (productId: string) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        isMain: product.id === productId,
      }))
    );
  };

  const handleDiscount = (productId: string, discount: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, unitDiscount: discount };
        }
        return product;
      })
    );
  };

  const handleSubmit = async (formData: FormData) => {
    formData.append("mainProductSku", mainProductSku);
    formData.append("purchaseOptionId", purchaseOptionId);
    formData.append("splitPayment", splitPayment);
    return formAction(formData);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col w-full lg:flex-row gap-2 p-4">
          <ContactFormCard
            title={"Lead Information - Select Products"}
            name={contact?.firstname || ""}
            lastname={contact?.lastname || ""}
            email={contact?.email || ""}
            id={contact?.id || ""}
          />

          <Card className="shadow-lg w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Please add at least a main product
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <SideProductSheet
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
            </CardContent>
          </Card>
        </div>

        <form
          action={handleSubmit}
          className="flex flex-1 flex-col items-center w-full p-4"
        >
          <input
            type="hidden"
            name="products"
            value={JSON.stringify(selectedProducts)}
          />

          <input type="hidden" name="dealId" value={dealId} />
          <input type="hidden" name="contactId" value={contactId} />

          <input
            type="hidden"
            name="lead_data"
            value={JSON.stringify(contact)}
          />

          <ProductCard
            selectedProducts={selectedProducts}
            totalPrice={totalPrice}
            serverErrors={serverErrors}
            onRemoveProduct={handleRemoveProduct}
            handleQuantity={handleQuantity}
            handleDiscount={handleDiscount}
          />
          <MainProductSelect
            selectedProducts={selectedProducts}
            onMainProductSelect={handleMainProductSelect}
            serverErrors={serverErrors}
          />
          <div className="w-full m-5">
            <RadioInput
              label="Does the lead require split Payment?"
              id="splitPayment"
              options={options}
              errorMsg={serverErrors?.splitPayment}
              value={splitPaymentValue}
              onChange={(value) => setSplitPayment(value)}
            />
          </div>
          {splitPaymentValue === "Yes" && purchaseOptions.length > 0 && (
            <div className="w-full mb-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    Purchase Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SelectInput
                    label="Select Purchase Option"
                    id="purchaseOptionId"
                    options={purchaseOptions}
                    placeholder="Select a purchase option"
                    errorMsg={serverErrors?.purchaseOptionId}
                    value={purchaseOptionIdValue}
                    onChange={(value) => setPurchaseOptionId(value)}
                    dataLoaded={true}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex w-full flex-col gap-4 lg:max-w-[700px]">
            <SubmitButton text="Save draft" />
          </div>
        </form>
      </div>
    </>
  );
}
