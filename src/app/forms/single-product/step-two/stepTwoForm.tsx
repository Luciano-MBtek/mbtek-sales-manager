"use client";
import { stepTwoFormSingleProductAction } from "./actions";
import { FormErrors, Product, YesOrNo } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import { useSingleProductContext } from "@/contexts/singleProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SideProductSheet } from "@/components/SideProductSheet";
import { useActionState, useEffect, useState } from "react";
import RadioInput from "@/components/StepForm/RadioButtonStepForm";

import ProductCard from "@/components/ProductCard";
import ContactFormCard from "@/components/StepForm/ContactFormCard";
import { useContactStore } from "@/store/contact-store";
import MainProductSelect from "@/components/MainProductSelect";
import MoneyValueInput from "@/components/StepForm/MoneyValueInput";
import { useSearchParams } from "next/navigation";
import SelectInput from "@/components/StepForm/SelectStepForm";

const options = YesOrNo.map((option) => option);

type ProductWithIsMain = Product & { isMain: boolean };

const initialState: FormErrors = {};

export default function StepSingleProductTwoForm() {
  const { singleProductData, updateSingleProductDetails, dataLoaded } =
    useSingleProductContext();
  const [serverErrors, formAction] = useActionState(
    stepTwoFormSingleProductAction,
    initialState
  );
  const [selectedProducts, setSelectedProducts] = useState<ProductWithIsMain[]>(
    singleProductData.products || []
  );

  const [totalPrice, setTotalPrice] = useState(0);
  const { contact, update } = useContactStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    updateSingleProductDetails({
      products: selectedProducts,
    });
    const totalPrice = selectedProducts.reduce((acc, product) => {
      if (!product.id) return acc;
      const discountedPrice =
        (product.price * (100 - (product.unitDiscount || 0))) / 100;
      return acc + discountedPrice * product.quantity;
    }, 0);
    setTotalPrice(totalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);

  useEffect(() => {
    if (dataLoaded && singleProductData.products) {
      setSelectedProducts(singleProductData.products);
    }
  }, [dataLoaded, singleProductData.products]);

  const formData = {
    ...singleProductData,
    name: contact?.firstname || singleProductData.name || "",
    lastname: contact?.lastname || singleProductData.lastname || "",
    email: contact?.email || singleProductData.email || "",
    id: contact?.id || singleProductData.id || "",
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
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

  const handleSelectChange = (field: string) => (value: string) => {
    updateSingleProductDetails({ [field]: value });
  };

  return (
    <>
      <div className="w-full flex flex-col  items-center">
        <div className="flex flex-col w-full lg:flex-row gap-2 p-4">
          <ContactFormCard
            title={"Lead Information - Select Products"}
            name={formData.name}
            lastname={formData.lastname}
            email={formData.email}
            id={formData.id}
          />

          <Card className="shadow-lg w-full ">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Please add at least a main product
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 ">
              <SideProductSheet
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
            </CardContent>
          </Card>
        </div>

        <form
          action={formAction}
          className="flex flex-1 flex-col items-center w-full p-4"
        >
          <input
            type="hidden"
            name="products"
            value={JSON.stringify(selectedProducts)}
          />
          <input
            type="hidden"
            name="lead_data"
            value={JSON.stringify(contact)}
          />
          <input
            type="hidden"
            name="shipmentCost"
            value={singleProductData.shipmentCost || ""}
          />
          <input
            type="hidden"
            name="purchaseOptionId"
            value={singleProductData.purchaseOptionId || ""}
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
              value={singleProductData.splitPayment || ""}
              onChange={(value) =>
                updateSingleProductDetails({ splitPayment: value })
              }
            />
          </div>
          {singleProductData.splitPayment === "Yes" && (
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
                    options={Array.from(searchParams.entries())
                      .filter(([key]) => key.startsWith("merchantCode_"))
                      .map(([key, value]) => {
                        const index = key.split("_")[1];
                        const idKey = `id_${index}`;
                        const idValue = searchParams.get(idKey) || "";

                        return {
                          label: `${value}`,
                          value: idValue,
                        };
                      })}
                    placeholder="Select a purchase option"
                    errorMsg={serverErrors?.purchaseOptionId}
                    value={singleProductData.purchaseOptionId || ""}
                    onChange={handleSelectChange("purchaseOptionId")}
                    dataLoaded={dataLoaded}
                  />
                </CardContent>
              </Card>
            </div>
          )}
          {/*   <div className="w-full flex items-center gap-10 m-5">
            <div>
              <RadioInput
                label="Custom Shipment"
                id="customShipment"
                options={options}
                errorMsg={serverErrors?.customShipment}
                value={singleProductData.customShipment || ""}
                onChange={(value) => {
                  // Si cambiamos a "No", resetear el shipmentCost
                  if (value === "No") {
                    updateSingleProductDetails({
                      customShipment: value,
                      shipmentCost: "",
                    });
                  } else {
                    updateSingleProductDetails({ customShipment: value });
                  }
                }}
              />
            </div>
            {singleProductData.customShipment === "Yes" && (
              <div>
                <MoneyValueInput
                  label="Shipment Cost"
                  id="shipmentCost"
                  errorMsg={serverErrors?.shipmentCost}
                  value={singleProductData.shipmentCost || ""}
                  onChange={(e) =>
                    updateSingleProductDetails({ shipmentCost: e.target.value })
                  }
                />
              </div>
            )}
          </div> */}

          <div className="flex w-full flex-col gap-4 lg:max-w-[700px] ">
            <SubmitButton text="Continue" />
          </div>
        </form>
      </div>
    </>
  );
}
