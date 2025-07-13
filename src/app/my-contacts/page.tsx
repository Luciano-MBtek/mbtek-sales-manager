import { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getContactsByOwnerId } from "@/actions/searchOwnedContacts";
import OwnedContactsTable from "./contacts-table";

export const metadata: Metadata = {
  title: "My Contacts",
  description: "Contacts associated with sales representative.",
};

type SearchParams = {
  hubspotId?: string;
};

const OwnedContactPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;
  const ownedContacts = await getContactsByOwnerId(undefined, params.hubspotId);

  const contacts = ownedContacts.results;
  const total = ownedContacts.total;
  const after = ownedContacts?.paging?.next?.after || 0;

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="My Contacts"
        subtitle={`You own ${ownedContacts.total} contacts.`}
      />
      {ownedContacts.total > 0 ? (
        <OwnedContactsTable
          contacts={contacts}
          initialTotal={total}
          after={after}
          hubspotId={params.hubspotId}
        />
      ) : (
        <p>No contacts yet.</p>
      )}
    </div>
  );
};

export default OwnedContactPage;
