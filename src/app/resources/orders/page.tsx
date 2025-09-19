import PageHeader from "@/components/PageHeader";
import OrdersSheet from "./OrdersSheet";

export const metadata = {
  title: "Orders | MBTEK Sales Dashboard",
  description: "View and manage orders in the Google Sheets interface.",
};

const OrdersPage = () => {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Orders"
        subtitle="View and manage orders in real-time"
      />
      <div className="mt-6">
        <div className="mb-4 text-sm text-muted-foreground">
          Resources / Tools / Orders
        </div>
        <OrdersSheet />
      </div>
    </div>
  );
};

export default OrdersPage;
