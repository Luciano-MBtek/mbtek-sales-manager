import { GetContactById } from "@/actions/getContactById";
import { getAllDealsDataWithLineItems } from "@/actions/getDealsData";
import DealsCard from "@/components/DealsCard";
import PageHeader from "@/components/PageHeader";
import SchematicRequestCard from "@/components/SchematicRequestCard";
import { SchematicData } from "@/schemas/schematicRequestSchema";

type Props = {
  params: Promise<{ id: string }>;
};

type SchematicDisplayData = Omit<
  SchematicData,
  "firstname" | "lastname" | "email" | "zip"
> & {
  documentation: string;
};
const ContactDealsPage = async (props: Props) => {
  const params = await props.params;

  const { id } = params;
  const contact = await GetContactById(id);

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
        .special_application as SchematicData["special_application"]) || "N/A",
    extra_notes: contact.properties.extra_notes,
    documentation:
      contact.properties.technical_documention_received_from_the_prospect,
  };
  return (
    <div className="flex flex-col w-full justify-center ">
      <PageHeader
        title="Schematic Data"
        subtitle={`Schematic requested at tech lead.`}
      />
      <SchematicRequestCard properties={schematicRequestProperties} />
    </div>
  );
};

export default ContactDealsPage;
