"use client";

import { startTransition, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, Trash, Edit } from "lucide-react";
import { Quote } from "@/types/quoteTypes";
import { toast } from "./ui/use-toast";
import { Quote as QuoteIcon } from "lucide-react";
import { deleteQuote } from "@/actions/quote/deleteQuote";
import Shopify from "./Icons/Shopify";
import TemplateModal from "./Email/TemplateModal";
import { useRouter, usePathname } from "next/navigation";

export function QuoteItem({ quote }: { quote: Quote }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const contactId = pathname.split("/")[2];

  const deleteQuoteAndDeal = (id: string) => {
    setIsPending(true);
    startTransition(() => {
      deleteQuote(id)
        .then(() => {
          toast({
            title: `Quote deleted`,
            description: (
              <div className="flex gap-2">
                <p className="text-primary">
                  {quote.properties.hs_title} and deal deleted.
                </p>
                <QuoteIcon width={20} />
              </div>
            ),
          });
        })
        .catch((error) => {
          toast({
            title: "Error deleting quote",
            description: <p className="text-destructive">{error.message}</p>,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsPending(false);
        });
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdateQuote = () => {
    router.push(`/contacts/${contactId}/quotes/${quote.id}`);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{quote.properties.hs_title}</span>
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
          <strong>Expiration Date:</strong>{" "}
          {formatDate(quote.properties.hs_expiration_date)}
        </p>
        <p className="mb-2">
          <strong>Amount:</strong> $
          {parseFloat(quote.properties.hs_quote_amount).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2 }
          )}
        </p>

        <div className="flex justify-between">
          <div className="flex gap-4">
            <Button
              variant="outline"
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
            <TemplateModal quote={quote} />
            <Button
              variant="outline"
              onClick={() => window.open(quote.properties.hs_terms, "_blank")}
            >
              <Shopify width={20} height={20} className="mr-2" /> Pay Now
            </Button>
            <Button variant="outline" onClick={handleUpdateQuote}>
              <Edit className="mr-2 h-4 w-4" /> Update Quote
            </Button>
          </div>
          <div>
            <Button
              variant="destructive"
              onClick={() => deleteQuoteAndDeal(quote.id)}
              disabled={isPending}
            >
              {isPending ? (
                "Deleting..."
              ) : (
                <div className="flex items-center gap-2">
                  <span>Delete</span>
                  <Trash
                    className="opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
