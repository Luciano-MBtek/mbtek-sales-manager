import { Task, TaskStatus } from "@/types/Tasks";
import { Phone, FileText, Calendar, CheckSquare, Flag } from "lucide-react";

export const getTaskIcon = (type: string) => {
  switch (type) {
    case "CALL":
      return <Phone className="h-4 w-4" />;
    case "NOTE":
      return <FileText className="h-4 w-4" />;
    case "MEETING":
      return <Calendar className="h-4 w-4" />;
    case "TODO":
      return <CheckSquare className="h-4 w-4" />;
    default:
      return <CheckSquare className="h-4 w-4" />;
  }
};

export const getTaskPriorityIcon = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return <Flag className="h-4 w-4 text-red-500" />;
    case "MEDIUM":
      return <Flag className="h-4 w-4 text-amber-500" />;
    case "LOW":
      return <Flag className="h-4 w-4 text-green-500" />;
    default:
      return <Flag className="h-4 w-4 text-gray-500" />;
  }
};

export const getStatusBadgeVariant = (status: TaskStatus) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "IN_PROGRESS":
      return "warning";
    case "NOT_STARTED":
      return "secondary";
    default:
      return "outline";
  }
};

export const truncateText = (text: string, maxLength: number = 120) => {
  if (!text) return "";
  const strippedText = text.replace(/<[^>]*>/g, "");
  return strippedText.length > maxLength
    ? `${strippedText.substring(0, maxLength)}...`
    : strippedText;
};

export const getContactInitials = (task: Task) => {
  if (!task.contactsData?.[0]) return "?";

  const firstName = task.contactsData[0].properties.firstname || "";
  const lastName = task.contactsData[0].properties.lastname || "";

  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const getContactName = (task: Task) => {
  if (!task.contactsData?.[0]) return "Unknown Contact";

  const firstName = task.contactsData[0].properties.firstname || "";
  const lastName = task.contactsData[0].properties.lastname || "";

  return `${firstName} ${lastName}`.trim() || "Unknown Contact";
};

export const getContactEmail = (task: Task) => {
  return task.contactsData?.[0]?.properties.email || "No email";
};
