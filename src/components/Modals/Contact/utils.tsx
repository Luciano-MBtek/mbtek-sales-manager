import { Mail, PhoneCall, Calendar, Notebook, CheckSquare } from "lucide-react";

export const getPriorityVariant = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "high":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "";
  }
};

export const getEngagementIcon = (type: string) => {
  switch (type) {
    case "EMAIL":
      return <Mail className="h-4 w-4" />;
    case "INCOMING_EMAIL":
      return <Mail className="h-4 w-4" />;
    case "CALL":
      return <PhoneCall className="h-4 w-4" />;
    case "MEETING":
      return <Calendar className="h-4 w-4" />;
    case "NOTE":
      return <Notebook className="h-4 w-4" />;
    case "TASK":
      return <CheckSquare className="h-4 w-4" />;
    default:
      return null;
  }
};
