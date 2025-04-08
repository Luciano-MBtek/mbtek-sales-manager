"use client";
import { ProductsTable } from "@/components/ProductsTable";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/actions/getAllProducts";
import { useState, useEffect } from "react";

interface APIProduct {
  id: string;
  properties: {
    name: string;
    hs_sku: string;
    hs_images: string;
    price: number;
  };
}

const ProductsDashboard = () => {
  const [products, setProducts] = useState<(Product & { isMain: boolean })[]>(
    []
  );

  const { isLoading, data } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const allProducts = await getAllProducts();
      return allProducts;
    },
  });

  useEffect(() => {
    if (data && "data" in data) {
      const mappedProducts = data.data.map((product: APIProduct) => ({
        id: product.id,
        name: product.properties.name || "",
        sku: product.properties.hs_sku || "",
        image: product.properties.hs_images || "",
        price: Number(product.properties.price) || 0,
        quantity: 1,
        unitDiscount: 0,
        selected: false,
        isMain: false,
      }));
      setProducts(mappedProducts);
    }
  }, [data]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Products Dashboard</h1>
      <ProductsTable
        products={products}
        isLoading={isLoading}
        showCheckboxes={false}
        searchPlaceholder="Search products..."
      />
    </div>
  );
};

export default ProductsDashboard;
