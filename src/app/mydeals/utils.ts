import { differenceInDays } from "date-fns";
import { Deal } from "./deals";

export const dealStage = {
  /* Complete System stages: */
  "1st meet: Info collection": "1067281266",
  "2nd meet: Quote Presentation & Close": "1067281268",
  "Follow-up #1 - Complete System": "1067281269",
  "Follow-up #2 - Complete System": "1067319836",
  "Closed Won - Complete System": "1067281271",
  "Closed Lost - Complete System": "1067281272",
  /* Instant Quote stages: */
  "Quote sent": "1067319842",
  "Follow-up #1": "1067319839",
  "Follow-Up #2": "1067319838",
  "Closed Won": "1067319843",
  "Closed Lost": "1067319844",
};

const dealStageColors: { [key: string]: string } = {
  // Mbtek - Complete System
  "1st meet: Info collection": "bg-blue-100 text-blue-800",
  "2nd meet: Quote Presentation & Close": "bg-indigo-100 text-indigo-800",
  "Follow-up #1 - Complete System": "bg-yellow-100 text-yellow-800",
  "Follow-up #2 - Complete System": "bg-orange-100 text-orange-800",
  "Closed Won - Complete System": "bg-green-100 text-green-800",
  "Closed Lost - Complete System": "bg-red-100 text-red-800",

  // Mbtek - Instant Quote
  "Quote sent": "bg-blue-100 text-blue-800",
  "Follow-up #1": "bg-yellow-100 text-yellow-800",
  "Follow-Up #2": "bg-orange-100 text-orange-800",
  "Closed Won": "bg-green-100 text-green-800",
  "Closed Lost": "bg-red-100 text-red-800",

  // Shopify prior (June 2025)
  "Checkout Abandoned (Shopify prior (June 2025))": "bg-gray-100 text-gray-800",
  "Checkout Pending (Shopify prior (June 2025))":
    "bg-yellow-100 text-yellow-800",
  "Deals pipeline- draft (Shopify prior (June 2025))":
    "bg-purple-100 text-purple-800",
  "Checkout Completed (Shopify prior (June 2025))":
    "bg-green-100 text-green-800",
  "Processed (Shopify prior (June 2025))": "bg-blue-100 text-blue-800",
  "Shipped (Shopify prior (June 2025))": "bg-indigo-100 text-indigo-800",
  "Cancelled (Shopify prior (June 2025))": "bg-red-100 text-red-800",
};

export const pipelineLabels = {
  "Mbtek - Complete System": "732661879",
  "Mbtek - Instant Quote": "732682097",
  "Shopify prior (June 2025)": "75e28846-ad0d-4be2-a027-5e1da6590b98",
};
export const getPipelineLabel = (value: string) => {
  return (
    Object.entries(pipelineLabels).find(([_, val]) => val === value)?.[0] ||
    value
  );
};

export const getDealStageLabel = (value: string) => {
  return (
    Object.entries(dealStage).find(([_, val]) => val === value)?.[0] || value
  );
};

export const getDealStageColor = (label: string) => {
  return dealStageColors[label] || "bg-gray-100 text-gray-800";
};

export const calculateDealProgress = (
  createDate: string,
  closeDate: string
) => {
  const start = new Date(createDate).getTime();
  const end = new Date(closeDate).getTime();
  const now = new Date().getTime();

  // If deal is already past closedate
  if (now > end) return 100;

  // If somehow createdate is after now (shouldn't happen)
  if (now < start) return 0;

  const totalDuration = end - start;
  const elapsedDuration = now - start;

  const percentage = Math.floor((elapsedDuration / totalDuration) * 100);

  // Cap percentage between 0 and 100
  return Math.max(0, Math.min(100, percentage));
};

// Check if deal is ending soon (within 3 days)
export const isEndingSoon = (closeDate: string) => {
  const close = new Date(closeDate);
  const now = new Date();
  const diffTime = close.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
};

export const getInitials = (firstname?: string, lastname?: string) => {
  if (!firstname && !lastname) return "NN";
  return `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();
};

export const calculateTotal = (deals: Deal[]) => {
  return deals.reduce(
    (sum, deal) => sum + Number.parseFloat(deal.properties.amount || "0"),
    0
  );
};

export const calculateDaysRemaining = (closeDate: string) => {
  const close = new Date(closeDate);
  const now = new Date();
  const daysLeft = differenceInDays(close, now);
  return daysLeft > 0 ? daysLeft : 0;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
