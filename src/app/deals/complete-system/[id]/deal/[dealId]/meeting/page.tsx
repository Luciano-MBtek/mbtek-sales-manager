import { GetContactById } from "@/actions/getContactById";
import MeetingForm from "./MeetingForm";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

export default async function Page({ params }: Props) {
  const { id, dealId } = await params;
  const contactData = await GetContactById(id, true);

  const ownerId = contactData?.properties?.hubspot_owner_id;

  return (
    <div className="p-4">
      <MeetingForm
        dealId={dealId}
        ownerId={ownerId}
        contactEmail={contactData?.properties?.email || ""}
        contactFirstName={contactData?.properties?.firstname || ""}
        contactLastName={contactData?.properties?.lastname || ""}
      />
    </div>
  );
}
