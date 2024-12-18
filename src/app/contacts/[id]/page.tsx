import { GetContactById } from "@/actions/getContactById";
import ContactStepProgress from "@/components/ContactStepProgress";
import { ProgressProperties } from "@/types";
import { SchematicData } from "@/schemas/schematicRequestSchema";
import SchematicRequestCard from "@/components/SchematicRequestCard";
import { getOwnerById } from "@/actions/getOwnerById";

import { checkDealsExist } from "@/actions/getDeals";
import { getQuoteById } from "@/actions/getQuoteById";
import ContactOwnerCard from "@/components/ContactOwnerCard";

type Props = {
  params: Promise<{ id: string }>;
};
type SchematicDisplayData = Omit<
  SchematicData,
  "firstname" | "lastname" | "email" | "zip"
> & {
  documentation: string;
};

const ContactFullData = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const contact = await GetContactById(id);

  const deals = await checkDealsExist(id);

  const quotes = await getQuoteById(id);

  const contactOwner = await getOwnerById(contact.properties.hubspot_owner_id);

  const hasSchematicRequest = Boolean(
    contact.properties.total_area_house && contact.properties.number_of_zones
  );
  const hasQuotes = quotes.length > 0;

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
    <div className="flex w-full flex-col items-center justify-center">
      <ContactOwnerCard
        owner={{
          id: contactOwner.id,
          email: contactOwner.email,
          firstName: contactOwner.firstName,
          lastName: contactOwner.lastName,
        }}
      />
      <div className="flex  gap-2 w-full items-center justify-between">
        <ContactStepProgress properties={progressProperties} />
      </div>
    </div>
  );
};

export default ContactFullData;
