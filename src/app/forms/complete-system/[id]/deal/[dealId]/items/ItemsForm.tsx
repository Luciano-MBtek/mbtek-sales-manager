"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { SideProductSheet } from "@/components/SideProductSheet";
import { Product } from "@/types";
import { createFormSubmitHandler } from "@/lib/sse";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WheelProgress } from "@/components/ui/wheel-progress";

interface ItemsFormProps {
  contactId: string;
  dealId: string;
}

export default function ItemsForm({ contactId, dealId }: ItemsFormProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [redirectOptions, setRedirectOptions] = useState<{ redirect1?: string; redirect2?: string } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const price = selectedProducts.reduce((acc, product) => {
      const discounted = (product.price * (100 - (product.unitDiscount || 0))) / 100;
      return acc + discounted * product.quantity;
    }, 0);
    setTotalPrice(price);
  }, [selectedProducts]);

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleQuantity = (productId: string, action: string) => {
    setSelectedProducts((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          const newQty = action === "increase" ? product.quantity + 1 : product.quantity - 1;
          return { ...product, quantity: Math.max(newQty, 1) };
        }
        return product;
      })
    );
  };

  const handleDiscount = (productId: string, discount: number) => {
    setSelectedProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, unitDiscount: discount } : product))
    );
  };

  const handleFormSubmit = createFormSubmitHandler("/api/generate/complete-system", {
    setIsSubmitting,
    setHasError,
    setIsComplete,
    setCurrentProgress,
    setCurrentStep,
    setShowDialog,
    setRedirectOptions,
    toast,
  });

  return (
    <>
      <form
        onSubmit={(e) => handleFormSubmit(e, { dealId, contactId, products: selectedProducts })}
        className="flex flex-col gap-4"
      >
        <SideProductSheet
          selectedProducts={selectedProducts as any}
          setSelectedProducts={setSelectedProducts as any}
        />
        <ProductCard
          selectedProducts={selectedProducts}
          totalPrice={totalPrice}
          onRemoveProduct={handleRemoveProduct}
          handleQuantity={handleQuantity}
          handleDiscount={handleDiscount}
        />
        <Button type="submit" disabled={isSubmitting} className="self-end">
          {isSubmitting ? "Processing..." : "Generate Quote"}
        </Button>
      </form>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!isComplete ? "Processing Quote" : hasError ? "Error Processing Quote" : "Quote Ready"}
            </DialogTitle>
            {!isComplete && (
              <DialogDescription>Please wait while we process your quote...</DialogDescription>
            )}
            {isComplete && !hasError && (
              <DialogDescription>Select an option to continue</DialogDescription>
            )}
          </DialogHeader>
          {currentProgress > 0 && (
            <div className="flex flex-col items-center gap-4 py-4">
              <WheelProgress value={currentProgress} size="lg" />
              <p className="text-center text-muted-foreground">{currentStep}</p>
            </div>
          )}
          {isComplete && !hasError && (
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => {
                  if (redirectOptions?.redirect1) window.open("http://" + redirectOptions.redirect1, "_blank");
                }}
              >
                Go to quote page
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (redirectOptions?.redirect2) router.push(redirectOptions.redirect2);
                }}
              >
                Back to main contact
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
