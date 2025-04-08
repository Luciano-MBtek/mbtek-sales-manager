import { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import ProductsDashboard from "./ProductsDashboard";

export const metadata: Metadata = {
  title: "Products",
  description: "Shopify product list.",
};

const ProductsPage = async () => {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Products"
        subtitle={`Shopify products listed on hubspot.`}
      />
      <ProductsDashboard />
    </div>
  );
};

export default ProductsPage;
