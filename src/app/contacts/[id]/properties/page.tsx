import { GetContactById } from "@/actions/getContactById";
import { Properties, columns } from "@/components/steps/columns";
import { DataTable } from "@/components/steps/data-table";
import { propertyNameMap, dateProperties } from "@/components/steps/utils";

type Props = {
  params: Promise<{ id: string }>;
};

const ContactProperties = async (props: Props) => {
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

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <DataTable columns={columns} data={formattedProperties} />
    </div>
  );
};

export default ContactProperties;
