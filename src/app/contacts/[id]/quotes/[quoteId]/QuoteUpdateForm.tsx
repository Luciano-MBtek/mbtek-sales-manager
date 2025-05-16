"use client";
import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import ContactFormCard from "@/components/StepForm/ContactFormCard";
import { useContactStore } from "@/store/contact-store";
import { LineItem } from "@/types/dealTypes";
import { Quote } from "@/types/quoteTypes";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { SideProductSheet } from "@/components/SideProductSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- NEW IMPORTS for SSE/modal ---
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WheelProgress } from "@/components/ui/wheel-progress";
import { createFormSubmitHandler } from "@/lib/sse";

interface QuoteParams {
  quote: (Quote & { lineItems?: LineItem[] }) | null;
  draftOrderId: string;
  draftOrderInvoice: string;
}

// Define el esquema de validación
const quoteFormSchema = z.object({
  lineItems: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitDiscount: z
        .number()
        .min(0)
        .max(100, "Discount must be between 0-100%"),
      price: z.number().min(0, "Price must be a positive number"),
      name: z.string(),
      sku: z.string().optional(),
      image: z.string().optional(),
      hs_product_id: z.string().optional(),
      dealId: z.string().optional(),
    })
  ),
  // Nuevo array para productos adicionales
  newProducts: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
        unitDiscount: z.number().min(0).max(100).default(0),
        sku: z.string().optional(),
        image: z.string().optional(),
        isMain: z.boolean().optional(),
      })
    )
    .optional(),
  dealId: z.string().optional(),
  contactId: z.string().optional(),
  quoteId: z.string().optional(),
  quoteLink: z.string().optional(),
  oldLineItemIds: z.array(z.string()).optional(),
  draftOrderId: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;
export type LineItemFormValues = z.infer<
  typeof quoteFormSchema.shape.lineItems
>[number];
export type NewProductFormValues = NonNullable<
  z.infer<typeof quoteFormSchema.shape.newProducts>
>[number];

const QuoteUpdateForm = ({ quote, draftOrderId }: QuoteParams) => {
  const { contact } = useContactStore();
  const router = useRouter();
  const { toast } = useToast();

  // --- NEW STATE for modal/progress ---
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [redirectOptions, setRedirectOptions] = useState<{
    redirect1?: string;
    redirect2?: string;
  } | null>(null);

  const [totalPrice, setTotalPrice] = useState(0);
  const [dealId, setDealId] = useState<string | undefined>(undefined);
  const [oldLineItemIds, setOldLineItemIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const originalLineItemsRef = useRef<LineItemFormValues[]>([]);

  // Estado para los nuevos productos seleccionados con SideProductSheet
  const [selectedNewProducts, setSelectedNewProducts] = useState<
    (Product & { isMain: boolean })[]
  >([]);

  console.log("Redirect Options: ", redirectOptions);

  // Redirect if no contact is available
  useEffect(() => {
    if (!contact?.id) {
      console.error("No contact found, redirecting...");
      router.push("/contacts"); // Redirect to contacts page
      return;
    }
  }, [contact, router]);

  useEffect(() => {
    if (quote?.lineItems?.length) {
      const originalLineItemIds = quote.lineItems.map((item) => item.id);
      setOldLineItemIds(originalLineItemIds);
    }
  }, [quote]);

  useEffect(() => {
    if (lineItems?.length) {
      // Store the original line items to compare later
      originalLineItemsRef.current = JSON.parse(JSON.stringify(lineItems));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkForChanges = () => {
    // If there are new products, we definitely have changes
    if (selectedNewProducts.length > 0) {
      setHasChanges(true);
      return;
    }

    // If the number of line items has changed, we have changes
    if (originalLineItemsRef.current.length !== lineItems.length) {
      setHasChanges(true);
      return;
    }

    // Check if any properties of existing line items have changed
    const hasLineItemChanges = lineItems.some((item, index) => {
      const originalItem = originalLineItemsRef.current[index];

      // If IDs don't match, order has changed or items were replaced
      if (originalItem?.id !== item.id) return true;

      // Check if quantity or discount changed
      return (
        originalItem.quantity !== item.quantity ||
        originalItem.unitDiscount !== item.unitDiscount
      );
    });

    setHasChanges(hasLineItemChanges);
  };

  // Preparar los datos iniciales para el formulario y extraer el dealId
  const mapLineItemsToProducts = () => {
    if (!quote?.lineItems?.length) return [];

    const mappedItems = quote.lineItems.map((item) => {
      // Extraer dealId de las asociaciones si existe
      const itemDealId = item.associations?.deals?.results[0]?.id;

      // Si encontramos un dealId y aún no hemos establecido uno global, lo guardamos
      if (itemDealId && !dealId) {
        setDealId(itemDealId);
      }

      return {
        id: item.id,
        name: item.properties.name,
        quantity: parseInt(item.properties.quantity, 10),
        price: parseFloat(item.properties.price),
        unitDiscount: item.properties.hs_discount_percentage
          ? parseFloat(item.properties.hs_discount_percentage)
          : 0,
        sku: item.properties.hs_sku,
        image: item.properties.hs_images || "/placeholder-product.jpg",
        hs_product_id: item.properties.hs_product_id,
        dealId: itemDealId,
      };
    });

    // Verificar que todos los line items tengan el mismo dealId
    const allDealIds = mappedItems
      .map((item) => item.dealId)
      .filter((id) => id !== undefined) as string[];

    if (allDealIds.length > 0) {
      const allSameDealId = allDealIds.every((id) => id === allDealIds[0]);
      if (!allSameDealId) {
        console.warn("Not all line items have the same deal ID");
      }
    }

    return mappedItems;
  };

  // Usar un tipo que no requiera contactId para defaultValues
  const defaultValues = {
    lineItems: mapLineItemsToProducts(),
    newProducts: [],
    dealId: dealId,
    contactId: contact?.id,
    oldLineItemIds: oldLineItemIds,
  };

  const methods = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues,
  });

  const { watch, setValue } = methods;

  // Actualizar el dealId y contactId en el formulario cuando cambien
  useEffect(() => {
    if (dealId) {
      setValue("dealId", dealId);
    }

    if (contact?.id) {
      setValue("contactId", contact.id);
    }
  }, [dealId, contact, setValue]);

  // Observar cambios en los productos para calcular el precio total
  const lineItems = watch("lineItems");

  useEffect(() => {
    checkForChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineItems, selectedNewProducts]);

  // Actualizar los valores del formulario cuando cambien los nuevos productos seleccionados
  useEffect(() => {
    setValue("newProducts", selectedNewProducts);
  }, [selectedNewProducts, setValue]);

  useEffect(() => {
    calculateTotalPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineItems, selectedNewProducts]);

  // Calcular el precio total considerando cantidad y descuento para ambos tipos de productos
  const calculateTotalPrice = () => {
    // Calcular total de los line items existentes
    const existingTotal = lineItems.reduce((sum, product) => {
      const discountedPrice =
        (product.price * (100 - (product.unitDiscount || 0))) / 100;
      return sum + discountedPrice * product.quantity;
    }, 0);

    // Calcular total de los nuevos productos
    const newProductsTotal = selectedNewProducts.reduce((sum, product) => {
      const discountedPrice =
        (product.price * (100 - (product.unitDiscount || 0))) / 100;
      return sum + discountedPrice * product.quantity;
    }, 0);

    setTotalPrice(existingTotal + newProductsTotal);
  };

  // Gestionar la eliminación de un producto existente
  const handleRemoveProduct = (productId: string) => {
    const updatedItems = lineItems.filter((item) => item.id !== productId);
    setValue("lineItems", updatedItems);
  };

  // Gestionar la eliminación de un producto nuevo
  const handleRemoveNewProduct = (productId: string) => {
    setSelectedNewProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  // Gestionar cambios en la cantidad para productos existentes
  const handleQuantity = (productId: string, action: string) => {
    const updatedItems = lineItems.map((item) => {
      if (item.id === productId) {
        let newQuantity = item.quantity;
        if (action === "increase") {
          newQuantity += 1;
        } else if (action === "decrease" && newQuantity > 1) {
          newQuantity -= 1;
        }

        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setValue("lineItems", updatedItems);
  };

  // Gestionar cambios en la cantidad para productos nuevos
  const handleNewProductQuantity = (productId: string, action: string) => {
    setSelectedNewProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          let newQuantity = product.quantity;
          if (action === "increase") {
            newQuantity += 1;
          } else if (action === "decrease" && newQuantity > 1) {
            newQuantity -= 1;
          }
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  // Gestionar cambios en el descuento para productos existentes
  const handleDiscount = (productId: string, discount: number) => {
    const updatedItems = lineItems.map((item) => {
      if (item.id === productId) {
        return { ...item, unitDiscount: discount };
      }
      return item;
    });

    setValue("lineItems", updatedItems);
  };

  // Gestionar cambios en el descuento para productos nuevos
  const handleNewProductDiscount = (productId: string, discount: number) => {
    setSelectedNewProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, unitDiscount: discount };
        }
        return product;
      })
    );
  };

  const handleRedirect = () => {
    if (redirectOptions?.redirect1 && countdown === null) {
      // Iniciar cuenta regresiva desde 5
      setCountdown(8);

      let hasOpened = false;

      // Configurar intervalo para actualizar el contador cada segundo
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev !== null && prev > 1) {
            return prev - 1;
          } else {
            // Cuando llegue a 0, limpiar intervalo y redirigir
            clearInterval(interval);

            // Use a flag to ensure the window is only opened once
            if (!hasOpened) {
              hasOpened = true;
              window.open(redirectOptions.redirect1, "_blank");
            }

            return null;
          }
        });
      }, 1000);
    }
  };

  // Manejar el envío del formulario
  const handleFormSubmit = createFormSubmitHandler("/api/update-single-quote", {
    setIsSubmitting,
    setHasError,
    setIsComplete,
    setCurrentProgress,
    setCurrentStep,
    setShowDialog,
    setRedirectOptions,
    toast,
  });

  // Si no hay contacto, no renderizar el formulario
  if (!contact?.id) {
    return null;
  }

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              ...methods.getValues(),
              dealId: dealId,
              contactId: contact?.id,
              quoteId: quote?.id,
              oldLineItemIds: oldLineItemIds,
              newProducts: selectedNewProducts,
              quoteLink: quote?.properties.hs_quote_link,
              draftOrderId,
            };
            handleFormSubmit(e, formData);
          }}
          className="space-y-6"
        >
          <div className="flex gap-4">
            <ContactFormCard
              title={"Lead information:"}
              name={contact?.firstname || ""}
              lastname={contact?.lastname || ""}
              email={contact?.email || ""}
              id={contact?.id || ""}
            />

            {/* Agregar el SideProductSheet para seleccionar nuevos productos */}
            <Card className="shadow-lg w-[400px]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Add Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SideProductSheet
                  selectedProducts={selectedNewProducts}
                  setSelectedProducts={setSelectedNewProducts}
                />
              </CardContent>
            </Card>
          </div>

          {/* Mostrar los productos existentes */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Existing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductCard
                selectedProducts={lineItems as Product[]}
                totalPrice={totalPrice}
                onRemoveProduct={handleRemoveProduct}
                handleQuantity={handleQuantity}
                handleDiscount={handleDiscount}
              />
            </CardContent>
          </Card>

          {/* Mostrar los nuevos productos seleccionados si hay alguno */}
          {selectedNewProducts.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  New Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductCard
                  selectedProducts={selectedNewProducts}
                  totalPrice={selectedNewProducts.reduce((sum, product) => {
                    const discountedPrice =
                      (product.price * (100 - (product.unitDiscount || 0))) /
                      100;
                    return sum + discountedPrice * product.quantity;
                  }, 0)}
                  onRemoveProduct={handleRemoveNewProduct}
                  handleQuantity={handleNewProductQuantity}
                  handleDiscount={handleNewProductDiscount}
                />
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              size="lg"
              className="bg-green-600"
              disabled={
                isSubmitting || (isComplete && !hasError) || !hasChanges
              }
            >
              {isSubmitting ? "Updating..." : "Update Quote"}
            </Button>
          </div>
        </form>
      </FormProvider>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!isComplete
                ? "Processing Quote"
                : hasError
                  ? "Error Processing Quote"
                  : "The quote is ready and published"}
            </DialogTitle>
            {!isComplete && (
              <DialogDescription>
                Please wait while we process your quote...
              </DialogDescription>
            )}
            {isComplete && !hasError && (
              <DialogDescription>
                Select an option to continue with the process
              </DialogDescription>
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
                onClick={handleRedirect}
                disabled={countdown !== null}
                className={countdown !== null ? "bg-amber-500" : ""}
              >
                {countdown !== null
                  ? `Preparing page template... ${countdown}s`
                  : "Go to quote page"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (redirectOptions?.redirect2) {
                    router.push(redirectOptions.redirect2);
                  }
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
};

export default QuoteUpdateForm;
