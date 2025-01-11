const dealStage = {
  "Info Collection (B2C - Complete systems and single products)": "186564893",
  "Proposal Preparation (B2C - Complete systems and single products)":
    "189164108",
  "Proposal Presentation (B2C - Complete systems and single products)":
    "186568469",
  "Follow-up #1 (B2C - Complete systems and single products)": "207244920",
  "Follow-up #2 (B2C - Complete systems and single products)": "207244921",
  "Closed Won (B2C - Complete systems and single products)": "208229412",
  "Closed Lost (B2C - Complete systems and single products)": "208229413",
  "Checkout Abandoned (Shopify imported Pipeline)": "checkout_abandoned",
  "Checkout Pending (Shopify imported Pipeline)": "checkout_pending",
  "Deals pipeline- draft (Shopify imported Pipeline)": "991082134",
  "Checkout Completed (Shopify imported Pipeline)": "checkout_completed",
  "Processed (Shopify imported Pipeline)": "processed",
  "Shipped (Shopify imported Pipeline)": "shipped",
  "Cancelled (Shopify imported Pipeline)": "cancelled",
  "Appointment scheduled (Mbtek Sales Pipeline (old))": "appointmentscheduled",
  "Discovery phase (not qualified to buy right now) (Mbtek Sales Pipeline (old))":
    "decisionmakerboughtin",
  "Qualified to buy (Mbtek Sales Pipeline (old))": "qualifiedtobuy",
  "Draft Order sent (Mbtek Sales Pipeline (old))": "contractsent",
  "Follow up to close (Mbtek Sales Pipeline (old))": "93153974",
  "Closed won (Mbtek Sales Pipeline (old))": "closedwon",
};

const dealStageColors: { [key: string]: string } = {
  // Etapas B2C
  "Info Collection (B2C - Complete systems and single products)":
    "bg-blue-100 text-blue-800",
  "Proposal Preparation (B2C - Complete systems and single products)":
    "bg-purple-100 text-purple-800",
  "Proposal Presentation (B2C - Complete systems and single products)":
    "bg-indigo-100 text-indigo-800",
  "Follow-up #1 (B2C - Complete systems and single products)":
    "bg-yellow-100 text-yellow-800",
  "Follow-up #2 (B2C - Complete systems and single products)":
    "bg-orange-100 text-orange-800",
  "Closed Won (B2C - Complete systems and single products)":
    "bg-green-100 text-green-800",
  "Closed Lost (B2C - Complete systems and single products)":
    "bg-red-100 text-red-800",

  // Etapas Shopify
  "Checkout Abandoned (Shopify imported Pipeline)": "bg-gray-100 text-gray-800",
  "Checkout Pending (Shopify imported Pipeline)":
    "bg-yellow-100 text-yellow-800",
  "Checkout Completed (Shopify imported Pipeline)":
    "bg-green-100 text-green-800",
  "Processed (Shopify imported Pipeline)": "bg-blue-100 text-blue-800",
  "Shipped (Shopify imported Pipeline)": "bg-indigo-100 text-indigo-800",
  "Cancelled (Shopify imported Pipeline)": "bg-red-100 text-red-800",

  // Etapas Mbtek
  "Appointment scheduled (Mbtek Sales Pipeline (old))":
    "bg-blue-100 text-blue-800",
  "Discovery phase (not qualified to buy right now) (Mbtek Sales Pipeline (old))":
    "bg-purple-100 text-purple-800",
  "Qualified to buy (Mbtek Sales Pipeline (old))":
    "bg-green-100 text-green-800",
  "Draft Order sent (Mbtek Sales Pipeline (old))":
    "bg-yellow-100 text-yellow-800",
  "Follow up to close (Mbtek Sales Pipeline (old))":
    "bg-orange-100 text-orange-800",
  "Closed won (Mbtek Sales Pipeline (old))": "bg-green-100 text-green-800",
};

export const getDealStageLabel = (value: string) => {
  return (
    Object.entries(dealStage).find(([_, val]) => val === value)?.[0] || value
  );
};

export const getDealStageColor = (label: string) => {
  return dealStageColors[label] || "bg-gray-100 text-gray-800";
};
