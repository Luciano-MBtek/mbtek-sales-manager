import { GetContactById } from "@/actions/getContactById";
import PageHeader from "@/components/PageHeader";
import SchematicRequestCard from "@/components/SchematicRequestCard";
import TechnicalDrawingCard from "@/components/TechnicalDrawingCard";
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

type TechnicalDrawing = {
  technicalDrawing: string;
};
const ContactDealsPage = async (props: Props) => {
  const params = await props.params;

  const { id } = params;
  const contact = await GetContactById(id);

  const schematicRequestProperties: SchematicDisplayData = {
    total_area: contact.properties.total_area_house,
    number_zones: contact.properties.number_of_zones,
    square_feet_zone: contact.properties.square_feet_per_zone,
    heat_elements: contact.properties.heat_elements
      ? typeof contact.properties.heat_elements === "string"
        ? contact.properties.heat_elements.includes(";")
          ? contact.properties.heat_elements.split(";")
          : [contact.properties.heat_elements]
        : []
      : [],
    special_application:
      (contact.properties
        .special_application as SchematicData["special_application"]) || "N/A",
    extra_notes: contact.properties.extra_notes,
    documentation:
      contact.properties.technical_documention_received_from_the_prospect,
  };

  const technicalDrawing: TechnicalDrawing = {
    technicalDrawing: contact.properties.schematic_image,
  };

  return (
    <div className="flex flex-col w-full items-center justify-center gap-4 mt-[--header-height]">
      <div>
        <PageHeader
          title="Schematic Data"
          subtitle={`Schematic requested at tech lead.`}
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <SchematicRequestCard properties={schematicRequestProperties} />
        {technicalDrawing.technicalDrawing && (
          <TechnicalDrawingCard
            technicalDrawing={technicalDrawing.technicalDrawing}
          />
        )}
      </div>
    </div>
  );
};

export default ContactDealsPage;
