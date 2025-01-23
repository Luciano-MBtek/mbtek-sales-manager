const MBTEK_URL = process.env.MBTEK_API;

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Commodity {
  name: string;
  partNumber: string;
  class: number;
  nmfc: string;
  quantity: number;
  weight: number;
  dimensions: Dimensions;
  uom: string;
}

interface Address {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}
interface FreightRateRequest {
  shipDate: string;
  to: Address;
  commodities: Commodity[];
}

export async function getFreightwiseRates(body: FreightRateRequest) {
  try {
    const response = await fetch(`${MBTEK_URL}/mbtek/get-rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Freightwise rates:", error);
    throw error;
  }
}
