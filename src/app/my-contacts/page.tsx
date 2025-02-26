import { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getContactsByOwnerId } from "@/actions/searchOwnedContacts";
import OwnedContactsTable from "./contacts-table";

export const metadata: Metadata = {
  title: "My Contacts",
  description: "Contacts associated with sales representative.",
};

const OwnedContactPage = async () => {
  const ownedContacts = await getContactsByOwnerId();

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
        />
      ) : (
        <p>No contacts yet.</p>
      )}
    </div>
  );
};

export default OwnedContactPage;
