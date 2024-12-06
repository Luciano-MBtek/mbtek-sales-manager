import { GetContactById } from "@/actions/getContactById";
import ContactStepProgress from "@/components/ContactStepProgress";
import { ProgressProperties } from "@/types";
import { SchematicData } from "@/schemas/schematicRequestSchema";
import SchematicRequestCard from "@/components/SchematicRequestCard";

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

  const progressProperties: ProgressProperties = {
    id: id,
    firstname: contact.properties.firstname || "N/A",
    lastname: contact.properties.lastname || "N/A",
    leadStatus: contact.properties.hs_lead_status || "N/A",
    email: contact.properties.email || "N/A",
    address: contact.properties.address || "N/A",
    country_us_ca: contact.properties.country_us_ca || "N/A",
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
  };

  const schematicRequestProperties: SchematicDisplayData = {
    total_area: contact.properties.total_area_house,
    number_zones: contact.properties.number_of_zones,
    square_feet_zone: contact.properties.square_feet_per_zone,
    heat_elements:
      (contact.properties.heat_elements?.split(
        ";"
      ) as SchematicData["heat_elements"]) || [],
    special_application:
      (contact.properties
        .special_application as SchematicData["special_application"]) || "None",
    extra_notes: contact.properties.extra_notes,
    documentation:
      contact.properties.technical_documention_received_from_the_prospect,
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex  gap-2 w-full items-center justify-between">
        <ContactStepProgress properties={progressProperties} />
        {schematicRequestProperties && (
          <SchematicRequestCard properties={schematicRequestProperties} />
        )}
      </div>
    </div>
  );
};

export default ContactFullData;
