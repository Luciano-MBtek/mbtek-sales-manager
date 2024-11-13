import { GetContactById } from "@/actions/getContactById";
import ContactStepProgress from "@/components/ContactStepProgress";
import { ProgressProperties } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

const ContactFullData = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const contact = await GetContactById(id);

  const progressProperties: ProgressProperties = {
    id: id,
    firstname: contact.properties.firstname || "N/A",
    lastname: contact.properties.lastname || "N/A",
    leadStatus: contact.properties.hs_lead_status || "N/A",
    email: contact.properties.email || "N/A",

    country_us_ca: contact.properties.country_us_ca || "N/A",
    totalProperties: Object.keys(contact.properties).length,
    emptyProperties: Object.values(contact.properties).filter(
      (value) => value === null || value === ""
    ).length,
    createDate: contact.properties.createdate || "N/A",
    lastModifiedDate: contact.properties.lastmodifieddate || "N/A",
    state: contact.properties.state_usa,
    province: contact.properties.province_territory,
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between">
        <ContactStepProgress properties={progressProperties} />
      </div>
    </div>
  );
};

export default ContactFullData;
