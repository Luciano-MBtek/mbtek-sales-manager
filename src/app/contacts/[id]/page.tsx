import { GetContactById } from "@/actions/getContactById";
import ContactStepProgress from "@/components/ContactStepProgress";
import { Properties, columns } from "@/components/steps/columns";
import { DataTable } from "@/components/steps/data-table";
import { propertyNameMap, dateProperties } from "@/components/steps/utils";
import { ProgressProperties } from "@/types";
import Stepper from "@/components/Stepper";

type Props = {
  params: Promise<{ id: string }>;
};

const contactFullData = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const contact = await GetContactById(id);

  const formattedProperties: Properties[] = Object.entries(contact.properties)
    .filter(([property]) => !dateProperties.hasOwnProperty(property))
    .map(([property, value]) => {
      const mappedProperty = propertyNameMap[property] || {
        friendlyName: property,
        step: 0,
      };
      return {
        friendlyName: mappedProperty.friendlyName,
        property,
        value: value !== null ? String(value) : "N/A",
        step: mappedProperty.step,
      };
    });

  const progressProperties: ProgressProperties = {
    firstname: contact.properties.firstname || "N/A",
    lastname: contact.properties.lastname || "N/A",
    leadStatus: contact.properties.hs_lead_status || "N/A",
    country_us_ca: contact.properties.country_us_ca || "N/A",
    totalProperties: Object.keys(contact.properties).length,
    emptyProperties: Object.values(contact.properties).filter(
      (value) => value === null || value === ""
    ).length,
    createDate: contact.properties.createdate || "N/A",
    lastModifiedDate: contact.properties.lastmodifieddate || "N/A",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between">
        {/*  <Stepper /> */}
        <ContactStepProgress properties={progressProperties} />
      </div>
      <DataTable columns={columns} data={formattedProperties} />
    </div>
  );
};

export default contactFullData;
