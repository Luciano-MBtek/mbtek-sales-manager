import { Option } from "@/components/ui/multiselect";

export const TicketStatus = [
  { label: "New", value: "1", pipeline: "support_pipeline" },
  {
    label: "Waiting on contact",
    value: "2",
    pipeline: "support_pipeline",
  },
  {
    label: "Waiting on us",
    value: "3",
    pipeline: "support_pipeline",
  },
  {
    label: "Closed",
    value: "4",
    pipeline: "support_pipeline",
  },
  {
    label: "Customer needs Callback",
    value: "1003072512",
    pipeline: "support_pipeline",
  },
  { label: "New Request", value: "253557793", pipeline: "schematics_pipeline" },
  { label: "In Progress", value: "253557794", pipeline: "schematics_pipeline" },
  {
    label: "Waiting on Sales",
    value: "253557795",
    pipeline: "schematics_pipeline",
  },
  { label: "Delivered", value: "253557796", pipeline: "schematics_pipeline" },
  {
    label: "Cancelled Request",
    value: "253584393",
    pipeline: "schematics_pipeline",
  },
  {
    label: "New Inquiry",
    value: "253679194",
    pipeline: "pre_delivery_pipeline",
  },
  {
    label: "Waiting for reply",
    value: "938463376",
    pipeline: "pre_delivery_pipeline",
  },
  { label: "Contacted", value: "253679195", pipeline: "pre_delivery_pipeline" },
  { label: "Follow Up", value: "253679196", pipeline: "pre_delivery_pipeline" },
  { label: "Close", value: "253679197", pipeline: "pre_delivery_pipeline" },
  {
    label: "Delivery Follow Up",
    value: "253609846",
    pipeline: "post_delivery_pipeline",
  },
  {
    label: "Waiting on Reply",
    value: "993657688",
    pipeline: "post_delivery_pipeline",
  },
  {
    label: "Shipping Issues",
    value: "253609847",
    pipeline: "post_delivery_pipeline",
  },
  {
    label: "Rewards Program",
    value: "253609849",
    pipeline: "post_delivery_pipeline",
  },
  { label: "Closed", value: "253503893", pipeline: "post_delivery_pipeline" },
  { label: "New", value: "993326966", pipeline: "help_desk" },
  { label: "Waiting on contact", value: "993326967", pipeline: "help_desk" },
  { label: "Waiting on us", value: "993326968", pipeline: "help_desk" },
  { label: "Closed", value: "993326969", pipeline: "help_desk" },
];

export const pipelines = [
  { label: "Support Pipeline", value: "0", pipeline: "support_pipeline" },
  {
    label: "Schematics Pipeline",
    value: "149497267",
    pipeline: "schematics_pipeline",
  },
  {
    label: "Pre-delivery Pipeline",
    value: "148924448",
    pipeline: "pre_delivery_pipeline",
  },
  {
    label: "Post-Delivery Pipeline",
    value: "149497353",
    pipeline: "post_delivery_pipeline",
  },
  { label: "Help Desk", value: "677828696", pipeline: "help_desk" },
];

export const categories: Option[] = [
  { label: "Tech Support", value: "PRODUCT_ISSUE" },
  { label: "General inquiry", value: "GENERAL_INQUIRY" },
  { label: "ETA", value: "ETA" },
  { label: "Billing issue", value: "BILLING_ISSUE" },
  { label: "Shipping questions", value: "SHIPPING_QUESTIONS" },
];

export const sourceType = [
  { label: "Chat", value: "CHAT" },
  { label: "Email", value: "EMAIL" },
  { label: "Form", value: "FORM" },
  { label: "Phone", value: "PHONE" },
];

export const PriorityLevel = [
  { label: "Low", value: "LOW", color: "bg-green-400" },
  { label: "Medium", value: "MEDIUM", color: "bg-yellow-500" },
  { label: "High", value: "HIGH", color: "bg-orange-500" },
  { label: "Urgent", value: "URGENT", color: "bg-red-600" },
];
