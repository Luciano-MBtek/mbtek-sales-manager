import { getDealsByUserId } from "@/actions/searchOwnerDeals";
import { Metadata } from "next";
import DealsTable from "./deals-table";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "My Deals",
  description: "Deals associated with contact owner.",
};

const DealsPage = async () => {
  const deals = await getDealsByUserId();

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="My Deals"
        subtitle={`Last ${deals.length} owned deals.`}
      />
      {deals.length > 0 ? <DealsTable deals={deals} /> : <p>No deals yet.</p>}
    </div>
  );
};

export default DealsPage;
