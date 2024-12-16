import { getAllDealsDataWithLineItems } from "@/actions/getDealsData";
import DealsCard from "@/components/DealsCard";
import PageHeader from "@/components/PageHeader";

type Props = {
  params: Promise<{ id: string }>;
};
const ContactDealsPage = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const deals = await getAllDealsDataWithLineItems(id);

  return (
    <div className="flex flex-col w-full  ">
      <PageHeader
        title="Contact Deals"
        subtitle={`${deals.length} ${deals.length > 1 ? "deals" : "deal"} with the contact.`}
      />
      {deals && <DealsCard deals={deals} />}
    </div>
  );
};

export default ContactDealsPage;
