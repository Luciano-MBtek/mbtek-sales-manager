"use server";

const BASE_URL = process.env.MBTEK_API;
const DRAFT_ORDER_URL = `${BASE_URL}/mbtek/shopify/draft`;

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address1: string;
  phone: string;
  city: string;
  province: string;
  country: string;
  zip: string;
}

interface LineItem {
  variant_id: string;
  quantity: number;
  applied_discount?: {
    value: number;
    value_type: "percentage";
    description: string;
    title: string;
  };
}

export async function createDraftOrder(
  lineItems: LineItem[],
  contactData: {
    firstname: string;
    lastname: string;
    email: string;
    address: string;
    city: string;
    state_usa?: string;
    province?: string;
    country_us_ca: string;
    zip: string;
    phone: string;
    hubspot_owner_id: {
      fullname: string;
    };
  },
  quoteTitle: string,
  shippingCost?: number
) {
  try {
    const shipping_address: ShippingAddress = {
      first_name: contactData.firstname,
      last_name: contactData.lastname,
      address1: contactData.address,
      phone: contactData.phone || "",
      city: contactData.city,
      province: contactData.state_usa || contactData.province || "",
      country: contactData.country_us_ca,
      zip: contactData.zip,
    };

    const shipping_lines = shippingCost
      ? {
          title: "Custom Shipping",
          price: shippingCost,
          handle: null,
          custom: true,
        }
      : null;

    const draftOrderPayload = {
      draft_order: {
        line_items: lineItems,
        email: contactData.email,
        customer: {
          email: contactData.email,
        },
        use_customer_default_address: true,
        currency: "USD",
        shipping_address,
        shipping_line: shipping_lines,
        note: quoteTitle,
        tags: `${contactData.hubspot_owner_id.fullname}, quote`,
      },
    };

    const response = await fetch(DRAFT_ORDER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draftOrderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error on draft order creation:", errorData);
      throw new Error(`Failed to create draft order: ${response.statusText}`);
    }

    const draftOrderData = await response.json();

    if (
      draftOrderData.data &&
      draftOrderData.data.draft_order &&
      draftOrderData.data.draft_order.invoice_url
    ) {
      return {
        success: true,
        invoiceUrl: draftOrderData.data.draft_order.invoice_url,
      };
    } else {
      throw new Error("Invoice URL not found in the response");
    }
  } catch (error) {
    console.error("Error in createDraftOrder:", error);
    throw new Error(
      "Failed to create draft order: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
