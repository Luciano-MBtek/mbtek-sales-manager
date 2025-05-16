"use client";
import { ProductsTable } from "@/components/ProductsTable";
import { Product } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts } from "@/actions/getAllProducts";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

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
  const queryClient = useQueryClient();

  const { isLoading, data, refetch } = useQuery({
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

  const refreshProducts = async () => {
    try {
      // Invalidar la cache para la query allProducts
      await queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      toast({
        title: "Products refreshed",
        description: "Product list has been updated with the latest data.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh product data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Products Dashboard</h1>
        <button
          onClick={refreshProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh Products"}
        </button>
      </div>
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
