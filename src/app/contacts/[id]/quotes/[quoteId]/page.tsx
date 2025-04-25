import { getQuoteFullDetail } from "@/actions/quote/getQuoteFullDetail";
import QuoteUpdateForm from "./QuoteUpdateForm";
import PageHeader from "@/components/PageHeader";

type Props = {
  params: Promise<{ quoteId: string }>;
};

const QuoteUpdate = async (props: Props) => {
  const params = await props.params;

  const { quoteId } = params;

  const quote = await getQuoteFullDetail(quoteId);

  console.log(quote);

  return (
    <div>
      <PageHeader
        title="Quote details"
        subtitle={`You can update the quote here.`}
      />
      <QuoteUpdateForm quote={quote} />
    </div>
  );
};

export default QuoteUpdate;
