import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, CheckCircle, Link, Download } from "lucide-react";
import { LineItem } from "@/types/dealTypes";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Quote } from "@/types/quoteTypes";

interface QuoteDetailsCardProps {
  quoteDetails: Quote & { lineItems?: LineItem[] };
}

export default function QuoteDetailsCard({
  quoteDetails,
}: QuoteDetailsCardProps) {
  if (!quoteDetails) {
    return null;
  }

  const { properties, lineItems } = quoteDetails;

  // Format dates
  const createdDate = properties.hs_createdate
    ? format(new Date(properties.hs_createdate), "MMM dd, yyyy")
    : "N/A";

  const expirationDate = properties.hs_expiration_date
    ? format(new Date(properties.hs_expiration_date), "MMM dd, yyyy")
    : "N/A";

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Previous Quote Details: {properties.hs_title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Created: {createdDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Expires: {expirationDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Status: </span>
              <Badge
                variant={
                  properties.hs_status === "APPROVED" ? "success" : "default"
                }
              >
                {properties.hs_status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">ID: {properties.hs_object_id}</span>
            </div>
          </div>

          {lineItems && lineItems.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">
                Quote contains {lineItems.length} line items
              </h3>
              <ul className="space-y-2">
                {lineItems.map((item) => (
                  <li key={item.id} className="text-sm">
                    • Line item ID: {item.id}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {properties.hs_quote_link && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(properties.hs_quote_link, "_blank")}
                className="flex items-center gap-1"
              >
                <Link className="h-4 w-4" />
                View Quote
              </Button>
            )}

            {properties.hs_pdf_download_link && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(properties.hs_pdf_download_link, "_blank")
                }
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}

            {properties.hs_terms && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(properties.hs_terms, "_blank")}
                className="flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                View Terms
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
