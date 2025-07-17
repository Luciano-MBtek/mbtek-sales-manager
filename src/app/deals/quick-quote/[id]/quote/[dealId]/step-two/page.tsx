import {
  getPurchaseOptions,
  PurchaseOption,
} from "@/actions/contact/createDownpayCart";
import { getDealLineItems } from "@/actions/deals/getDealLineItems";
import { getDealById } from "@/actions/deals/getDealsById";
import StepTwoQuickQuote from "./StepTwoQuickQuote";
import { LineItem } from "@/types/dealTypes";

export const metadata = {
  title: "Quick Quote - Step Two",
  description: "Add products",
};

type Props = { params: Promise<{ id: string; dealId: string }> };

const Page = async ({ params }: Props) => {
  const { id, dealId } = await params;
  const purchaseOptions: PurchaseOption[] = await getPurchaseOptions();
  const dealData = await getDealById(dealId, false);
  const lineItemsData = await getDealLineItems(dealId, false);

  const formattedPurchaseOptions = purchaseOptions.map((option) => ({
    label: option.merchantCode,
    value: option.purchaseOptions[0].id,
  }));

  const mainProductSku = dealData?.properties?.main_product || "";
  const splitPayment = dealData?.properties.split_payment || "";
  const purchaseOptionId = dealData?.properties.purchase_option_id || "";
  const lineItems = lineItemsData || [];

  const products = lineItems.map((item: LineItem) => ({
    id: item.properties.hs_product_id || "",
    name: item.properties.name || "",
    price: Number(item.properties.price) || 0,
    quantity: Number(item.properties.quantity) || 1,
    unitDiscount: Number(item.properties.hs_discount_percentage) || 0,
    isMain: item.properties.hs_sku === mainProductSku,
    sku: item.properties.hs_sku || "",
    image: item.properties.hs_images,
  }));

  return (
    <div className="flex flex-col items-center">
      <StepTwoQuickQuote
        dealId={dealId}
        contactId={id}
        initialProducts={products}
        purchaseOptions={formattedPurchaseOptions}
        purchaseOptionId={purchaseOptionId}
        mainProductSku={mainProductSku}
        splitPayment={splitPayment}
      />
    </div>
  );
};

export default Page;
