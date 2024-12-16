"use client";

import { Label } from "@/components/ui/label";
import { ListBox, ListBoxItem } from "react-aria-components";
import { FormErrors, Product } from "@/types";

interface MainProductSelectProps {
  selectedProducts: Product[];
  onMainProductSelect: (productId: string) => void;
  serverErrors?: FormErrors;
  error?: string;
}

export default function MainProductSelect({
  selectedProducts,
  onMainProductSelect,
  serverErrors,
}: MainProductSelectProps) {
  const mainProductId = selectedProducts.find((p) => p.isMain)?.id;

  return (
    <div className="flex flex-col w-full mt-4 gap-2">
      <Label className="block text-primary text-lg mb-2">
        Select the main product
      </Label>
      {serverErrors?.products && (
        <p className="text-red-500">{serverErrors.products}</p>
      )}
      <div className="overflow-hidden rounded-lg border border-input">
        <ListBox
          className="space-y-1 bg-background p-1 text-sm shadow-sm shadow-black/5 transition-shadow"
          aria-label="Select main product"
          selectionMode="single"
          selectedKeys={mainProductId ? [mainProductId] : []}
          onSelectionChange={(keys) => {
            const selectedId = Array.from(keys)[0]?.toString();
            if (selectedId) onMainProductSelect(selectedId);
          }}
        >
          {selectedProducts.map((product) => (
            <ListBoxItem
              key={product.id}
              id={product.id}
              className="relative cursor-pointer text-primary rounded-md px-2 py-1.5 data-[disabled]:cursor-not-allowed
               data-[selected=true]:bg-success data-[selected=true]:text-secondary data-[disabled]:opacity-50
                data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70"
            >
              {product.name}
            </ListBoxItem>
          ))}
        </ListBox>
      </div>
    </div>
  );
}
