import { getQuoteFullDetail } from "@/actions/quote/getQuoteFullDetail";
import QuoteUpdateForm from "./QuoteUpdateForm";
import PageHeader from "@/components/PageHeader";
import { getDealById } from "@/actions/deals/getDealsById";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  params: Promise<{ quoteId: string }>;
};

const QuoteUpdate = async (props: Props) => {
  const params = await props.params;

  const { quoteId } = params;

  const quote = await getQuoteFullDetail(quoteId);

  const dealData = await getDealById(
    quote?.associations?.deals.results[0].id || ""
  );

  const draftOrderId = dealData?.properties.shopify_draft_order_id;
  const draftOrderInvoice = dealData?.properties.shopify_draft_order_url;

  // Removed development-only logs

  return (
    <div className="flex flex-col w-full items-center">
      <PageHeader
        title="Quote details"
        subtitle={`You can update the quote here.`}
      />
      {draftOrderId && draftOrderInvoice ? (
        <QuoteUpdateForm
          quote={quote}
          draftOrderId={draftOrderId}
          draftOrderInvoice={draftOrderInvoice}
        />
      ) : (
        <div className="flex justify-center w-full mt-6">
          <Card className="max-w-lg w-full border-destructive border-2">
            <CardHeader>
              <CardTitle className="text-center">No Update Available</CardTitle>
              <CardDescription className="text-center">
                This may be an old quote or a split payment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="gray-600 text-center">
                Split payments cannot be updated. Delete the quote and create a
                new one if necessary.
              </p>
              {/* Debug panel removed in cleanup */}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuoteUpdate;
