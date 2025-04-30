import { GetContactById } from "@/actions/getContactById";
import ContactStepProgress from "@/components/ContactStepProgress";
import { ProgressProperties } from "@/types";
import { getOwnerById } from "@/actions/getOwnerById";

import { checkDealsExist } from "@/actions/getDeals";
import { getQuoteById } from "@/actions/quote/getQuoteById";
import ContactOwnerCard from "@/components/ContactOwnerCard";
import ContactSummary from "@/components/ContactSummary";
import { getTicketsFromContacts } from "@/actions/getTicketsFromContact";
import OpenTicketsCard from "@/components/Ticket/OpenTicketsCard";

type Props = {
  params: Promise<{ id: string }>;
};

const ContactFullData = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const contact = await GetContactById(id);

  const deals = await checkDealsExist(id);

  const quotes = await getQuoteById(id);

  const tickets = await getTicketsFromContacts(id);

  const contactOwner = await getOwnerById(
    contact.properties.hubspot_owner_id,
    id
  );

  const hasSchematicRequest = Boolean(
    contact.properties.total_area_house && contact.properties.number_of_zones
  );
  const hasQuotes = quotes.length > 0;

  const contactSummary = contact.properties.project_summary_user;

  const progressProperties: ProgressProperties = {
    id: id,
    firstname: contact.properties.firstname || "N/A",
    lastname: contact.properties.lastname || "N/A",
    leadStatus: contact.properties.hs_lead_status || "N/A",
    email: contact.properties.email || "N/A",
    address: contact.properties.address || "N/A",
    country_us_ca: contact.properties.country_us_ca || "N/A",
    phone: contact.properties.phone || "N/A",
    totalProperties: Object.keys(contact.properties).length,
    emptyProperties: Object.values(contact.properties).filter(
      (value) => value === null || value === ""
    ).length,
    createDate: contact.properties.createdate || "N/A",
    lastModifiedDate: contact.properties.lastmodifieddate || "N/A",
    state: contact.properties.state_usa,
    province: contact.properties.province_territory,
    city: contact.properties.city || "N/A",
    zip: contact.properties.zip || "N/A",
    areDeals: deals,
    hasSchematic: hasSchematicRequest,
    hasQuotes: hasQuotes,
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <ContactOwnerCard
        owner={
          contactOwner && contactOwner.id
            ? {
                id: contactOwner.id,
                email: contactOwner.email,
                firstName: contactOwner.firstName,
                lastName: contactOwner.lastName,
              }
            : null
        }
      />
      {tickets.length > 0 && (
        <div className="flex w-full items-center justify-between">
          <OpenTicketsCard tickets={tickets} />
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <ContactStepProgress properties={progressProperties} />
      </div>
      {contactSummary && (
        <div>
          <ContactSummary contactSummary={contactSummary} />
        </div>
      )}
    </div>
  );
};

export default ContactFullData;
