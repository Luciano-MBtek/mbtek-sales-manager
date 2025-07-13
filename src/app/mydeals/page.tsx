import { getDealsByUserId } from "@/actions/searchOwnerDeals";
import { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DealsKanbanBoard from "./deals-kanban-board";

export const metadata: Metadata = {
  title: "My Deals",
  description: "Deals associated with contact owner.",
};
type SearchParams = {
  hubspotId?: string;
};

const DealsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;
  const deals = await getDealsByUserId(params.hubspotId);

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="My Deals"
        subtitle={`Manage your sales pipeline - ${deals.length} active deals.`}
      />
      {deals.length > 0 ? (
        <DealsKanbanBoard deals={deals} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No deals yet.</p>
        </div>
      )}
    </div>
  );
};

export default DealsPage;
