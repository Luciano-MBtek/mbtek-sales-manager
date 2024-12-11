"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download } from "lucide-react";
import { Quote } from "@/types/quoteTypes";

export function QuoteItem({ quote }: { quote: Quote }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Quote #{quote.id}</span>
          <Badge
            variant={
              quote.properties.hs_status === "APPROVED"
                ? "success"
                : "secondary"
            }
          >
            {quote.properties.hs_status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          <strong>Creation Date:</strong> {formatDate(quote.createdAt)}
        </p>
        <p className="mb-2">
          <strong>Amount:</strong> $
          {parseFloat(quote.properties.hs_quote_amount).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2 }
          )}
        </p>
        {isExpanded && (
          <div className="mt-4">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() =>
                window.open(quote.properties.hs_quote_link, "_blank")
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" /> View Quote
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open(quote.properties.hs_pdf_download_link, "_blank")
              }
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        )}
        <Button
          variant="link"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 p-0"
        >
          {isExpanded ? "View Less" : "View More"}
        </Button>
      </CardContent>
    </Card>
  );
}
