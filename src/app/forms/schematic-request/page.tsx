import { Metadata } from "next";
import SchematicRequestForm from "./schematicRequestForm";

export const metadata: Metadata = {
  title: "Schematic Request",
  description: "Request an schematic to the team.",
};
const SchematicRequest = () => {
  return (
    <>
      <SchematicRequestForm />
    </>
  );
};

export default SchematicRequest;
