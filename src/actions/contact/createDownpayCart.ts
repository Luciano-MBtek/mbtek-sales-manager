"use server";

const BASE_URL = process.env.MBTEK_API;
const CREATE_CART_URL = `${BASE_URL}/mbtek/shopify/createCart`;
const OPTIONS_URL = `${BASE_URL}/mbtek/downpay/purchase-options`;

interface CartLine {
  quantity: number;
  merchandiseId: string;
  sellingPlanId: string;
}

interface BuyerIdentity {
  email: string;
  countryCode: string;
  deliveryAddressPreferences: Array<{
    deliveryAddress: {
      address1: string;
      city: string;
      province: string;
      country: string;
      firstName: string;
      lastName: string;
      zip: string;
    };
  }>;
}

export async function getPurchaseOptions() {
  try {
    const response = await fetch(OPTIONS_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch purchase options: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("Error fetching purchase options:", error);
    throw new Error(
      "Failed to fetch purchase options: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

export async function createDownpayCart(
  lines: CartLine[],
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
  }
) {
  try {
    const countryCode = contactData.country_us_ca === "USA" ? "US" : "CA";

    const createOrderPayload = {
      lines,
      buyerIdentity: {
        email: contactData.email,
        countryCode,
        deliveryAddressPreferences: [
          {
            deliveryAddress: {
              address1: contactData.address,
              city: contactData.city,
              province: contactData.state_usa || contactData.province || "",
              country: contactData.country_us_ca,
              firstName: contactData.firstname,
              lastName: contactData.lastname,
              zip: contactData.zip,
            },
          },
        ],
      } as BuyerIdentity,
    };

    const response = await fetch(CREATE_CART_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createOrderPayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create cart: ${response.statusText}`);
    }

    const cartOrderData = await response.json();

    if (cartOrderData.checkoutUrl) {
      return {
        success: true,
        checkoutUrl: cartOrderData.checkoutUrl,
      };
    } else {
      throw new Error("Checkout URL not found in the response");
    }
  } catch (error) {
    console.error("Error in createDownpayCart:", error);
    throw new Error(
      "Failed to create downpay cart: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
