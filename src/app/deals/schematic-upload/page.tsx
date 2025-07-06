import { Metadata } from "next";
import SchematicUploadForm from "./schematicUploadForm";

export const metadata: Metadata = {
  title: "Schematic Upload",
  description: "Upload an schematic for the sales agents.",
};
const SchematicUpload = () => {
  return (
    <>
      <SchematicUploadForm />
    </>
  );
};

export default SchematicUpload;
