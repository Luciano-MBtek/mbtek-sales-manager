import { getAllQuotes } from "@/actions/getAllQuotes";
import { QuoteItem } from "@/components/QuoteCards";

type Props = {
  params: Promise<{ id: string }>;
};

const QuotesDetails = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const quotes = await getAllQuotes(id);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quotes</h1>
      {quotes.length > 0 ? (
        quotes.map((quote) => <QuoteItem key={quote.id} quote={quote} />)
      ) : (
        <p>No quotes were found for this ID.</p>
      )}
    </div>
  );
};

export default QuotesDetails;
