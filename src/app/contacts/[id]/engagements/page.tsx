import { getEngagementsById } from "@/actions/getEngagementsById";
import EngagementTabs from "@/components/EngagementsTab";
import PageHeader from "@/components/PageHeader";

type Props = {
  params: Promise<{ id: string }>;
};
const ContactEngagementsPage = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const engagements = await getEngagementsById(id);

  const length = engagements.results.length;
  return (
    <div className="flex flex-col w-full mt-[--header-height] p-2 ">
      <PageHeader
        title="Contact Engagements"
        subtitle={`${length} Engagements with the contact.`}
      />
      <EngagementTabs engagements={engagements} />
    </div>
  );
};

export default ContactEngagementsPage;
