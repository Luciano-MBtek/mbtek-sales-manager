import { GetContactById } from "@/actions/getContactById";
import { Properties, columns } from "@/components/steps/columns";
import { DataTable } from "@/components/steps/data-table";
import { propertyNameMap, dateProperties } from "@/components/steps/utils";

type Props = {
  params: { id: string };
};

const contactFullData = async ({ params: { id } }: Props) => {
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

  const dateValues = {
    createDate: contact.properties.createdate || "N/A",
    lastModifiedDate: contact.properties.lastmodifieddate || "N/A",
  };

  return (
    <div className="flex items-center justify-center">
      <DataTable columns={columns} data={formattedProperties} />
      {/* You can use dateValues in another component here */}
    </div>
  );
};

export default contactFullData;
