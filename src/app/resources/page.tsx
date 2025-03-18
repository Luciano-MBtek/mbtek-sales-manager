import { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import ResourcesGrid from "./resources-grid";

export const metadata: Metadata = {
  title: "Resources",
  description: "Access sales and tools references.",
};

const ResourcesPage = async () => {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Resources"
        subtitle={`Access sales and tools references.`}
      />
      <ResourcesGrid />
    </div>
  );
};

export default ResourcesPage;
