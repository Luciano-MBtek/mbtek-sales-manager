"use client";
import { useState, useEffect } from "react";
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

interface QuoteParams {
  quote: (Quote & { lineItems?: LineItem[] }) | null;
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
  dealId: z.string().optional(),
  contactId: z.string().optional(),
  quoteId: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const QuoteUpdateForm = ({ quote }: QuoteParams) => {
  const { contact } = useContactStore();
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);
  const [dealId, setDealId] = useState<string | undefined>(undefined);

  // Redirect if no contact is available
  useEffect(() => {
    if (!contact?.id) {
      console.error("No contact found, redirecting...");
      router.push("/contacts"); // Redirect to contacts page
      return;
    }
  }, [contact, router]);

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
    dealId: dealId,
    contactId: contact?.id, // TypeScript no se quejará si es undefined
  };

  const methods = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;

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
    calculateTotalPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineItems]);

  // Calcular el precio total considerando cantidad y descuento
  const calculateTotalPrice = () => {
    const total = lineItems.reduce((sum, product) => {
      const discountedPrice =
        (product.price * (100 - (product.unitDiscount || 0))) / 100;
      return sum + discountedPrice * product.quantity;
    }, 0);

    setTotalPrice(total);
  };

  // Gestionar la eliminación de un producto
  const handleRemoveProduct = (productId: string) => {
    const updatedItems = lineItems.filter((item) => item.id !== productId);
    setValue("lineItems", updatedItems);
  };

  // Gestionar cambios en la cantidad
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

  // Gestionar cambios en el descuento
  const handleDiscount = (productId: string, discount: number) => {
    const updatedItems = lineItems.map((item) => {
      if (item.id === productId) {
        return { ...item, unitDiscount: discount };
      }
      return item;
    });

    setValue("lineItems", updatedItems);
  };

  // Manejar el envío del formulario
  const onSubmit = (data: QuoteFormValues) => {
    // Incluir el dealId y contactId en los datos enviados
    const formData = {
      ...data,
      dealId: dealId,
      contactId: contact?.id, // Incluir contactId si existe
    };

    console.log("Form data to submit:", formData);
    // TODO: Implementar la acción de guardado al backend
  };

  // Si no hay contacto, no renderizar el formulario
  if (!contact?.id) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ContactFormCard
          title={"Lead information:"}
          name={contact?.firstname || ""}
          lastname={contact?.lastname || ""}
          email={contact?.email || ""}
          id={contact?.id || ""}
        />

        <ProductCard
          selectedProducts={lineItems as Product[]}
          totalPrice={totalPrice}
          onRemoveProduct={handleRemoveProduct}
          handleQuantity={handleQuantity}
          handleDiscount={handleDiscount}
        />

        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg">
            Update Quote
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default QuoteUpdateForm;
