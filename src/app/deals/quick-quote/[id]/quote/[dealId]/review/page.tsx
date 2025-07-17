import { getDealLineItems } from "@/actions/deals/getDealLineItems";
import { getDealById } from "@/actions/deals/getDealsById";
import StepThreeQuickQuote from "./StepThreeQuickQuote";
import { Metadata } from "next";
import { LineItem } from "@/types/dealTypes";
import {
  getPurchaseOptions,
  PurchaseOption,
} from "@/actions/contact/createDownpayCart";
import { getQuoteByDealId } from "@/actions/quote/getQuoteByDealId";
import { getQuoteFullDetail } from "@/actions/quote/getQuoteFullDetail";
import { GetContactById } from "@/actions/getContactById";

export const metadata: Metadata = {
  title: "Quick Quote - Review",
  description: "Review and finalize your quote",
};

type Props = { params: Promise<{ id: string; dealId: string }> };

const page = async ({ params }: Props) => {
  const { id, dealId } = await params;

  const purchaseOptions: PurchaseOption[] = await getPurchaseOptions();
  const formattedPurchaseOptions = purchaseOptions.map((option) => ({
    label: option.merchantCode,
    value: option.purchaseOptions[0].id,
  }));
  const contact = await GetContactById(id);
  const mainProduct = contact.properties.main_product_sku;
  const dealData = await getDealById(dealId, false);
  const lineItemsData = await getDealLineItems(dealId, false);
  const quoteAssociated = await getQuoteByDealId(dealId);
  const quoteId = quoteAssociated[0];
  const draftOrderId = dealData?.properties.shopify_draft_order_id || "";
  const mainProductSku = dealData?.properties?.main_product || "";
  const splitPayment = dealData?.properties.split_payment || "";
  const purchaseOptionId = dealData?.properties.purchase_option_id || "";
  const dealOwnerId = dealData?.properties.hubspot_owner_id || "";
  const lineItems = lineItemsData || [];

  const quoteDetails = quoteId ? await getQuoteFullDetail(quoteId) : null;

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
    <StepThreeQuickQuote
      dealId={dealId}
      contactId={id}
      contact={contact}
      products={products}
      splitPayment={splitPayment}
      purchaseOptionId={purchaseOptionId}
      purchaseOptions={formattedPurchaseOptions}
      mainProduct={mainProduct}
      dealOwnerId={dealOwnerId}
      draftOrderId={draftOrderId}
      quoteId={quoteId}
      quoteDetails={quoteDetails}
    />
  );
};

export default page;
