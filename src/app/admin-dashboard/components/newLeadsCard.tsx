import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { getQualifiedLeadsByDate } from "@/actions/admin-dashboard/getQualifiedLeadsByDate";

// Define a type for the component props
type NewLeadsCardProps = {
  searchParams?: {
    from?: string;
    to?: string;
    hubspotId?: string;
  };
};

export default async function NewLeadsCard({
  searchParams,
}: NewLeadsCardProps) {
  // Default dates if not provided in URL
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Safely handle the date parsing
  let fromDate = firstDayOfMonth;
  let toDate = today;

  try {
    if (searchParams?.from) {
      fromDate = new Date(searchParams.from);
      // Validate the date
      if (isNaN(fromDate.getTime())) {
        fromDate = firstDayOfMonth;
      }
    }

    if (searchParams?.to) {
      toDate = new Date(searchParams.to);
      // Validate the date
      if (isNaN(toDate.getTime())) {
        toDate = today;
      }
    }
  } catch (error) {
    console.error("Error parsing dates:", error);
    // Fallback to default dates if there's an error
    fromDate = firstDayOfMonth;
    toDate = today;
  }

  // Convert to ISO string for the API
  const startDateISO = fromDate.toISOString();
  const endDateISO = toDate.toISOString();

  // Fetch the leads count
  const count = await getQualifiedLeadsByDate(
    startDateISO,
    endDateISO,
    searchParams?.hubspotId
  );

  // Format the date range for display
  const dateRangeText = `${format(fromDate, "MMM dd")} - ${format(toDate, "MMM dd, yyyy")}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">New Leads</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{count || 0}</div>
        <p className="text-xs text-muted-foreground">{dateRangeText}</p>
      </CardContent>
    </Card>
  );
}
