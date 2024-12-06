"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Ruler, Grid, Blocks, FileText } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";

type SchematicDisplayProps = {
  total_area?: string;
  number_zones?: string;
  square_feet_zone?: string;
  heat_elements: string[];
  special_application: string;
  extra_notes?: string;
  documentation?: string;
};

const getFileType = (
  url: string
): "application/pdf" | "image/jpeg" | "image/png" | "image/svg+xml" | null => {
  const extension = url.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "svg":
      return "image/svg+xml";
    default:
      return null;
  }
};

const SchematicRequestCard = ({
  properties,
}: {
  properties: SchematicDisplayProps;
}) => {
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);

  const renderDocumentation = () => {
    if (!properties.documentation) return "N/A";

    const fileType = getFileType(properties.documentation);
    if (!fileType) return "Formato no soportado";

    if (fileType === "application/pdf") {
      return (
        <>
          <Button
            onClick={() => setIsDocumentOpen(true)}
            className="hover:underline"
          >
            View PDF
          </Button>
          <Dialog open={isDocumentOpen} onOpenChange={setIsDocumentOpen}>
            <DialogContent className="w-full max-w-4xl h-[80%]">
              <DialogTitle hidden>Technical Documentation</DialogTitle>
              <iframe
                src={properties.documentation}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </DialogContent>
          </Dialog>
        </>
      );
    }

    if (fileType.startsWith("image/")) {
      return (
        <div>
          <Button
            onClick={() => setIsDocumentOpen(true)}
            className="hover:underline"
          >
            View Image
          </Button>
          <Dialog open={isDocumentOpen} onOpenChange={setIsDocumentOpen}>
            <DialogContent className="w-full max-w-4xl">
              <DialogTitle hidden>Image Documentation</DialogTitle>
              <Image
                src={properties.documentation}
                alt="Documentation"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
              />
            </DialogContent>
          </Dialog>
          <Image
            src={properties.documentation}
            alt="Documentation Preview"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
      );
    }

    return "Formato no soportado";
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          Schematic Request Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Ruler className="w-6 h-6 text-primary" />
          <div>
            <p className="font-semibold">Area Details</p>
            <p className="text-sm text-muted-foreground">
              Total Area: {properties.total_area || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Grid className="w-6 h-6 text-primary" />
          <div>
            <p className="font-semibold">Zone Information</p>
            <p className="text-sm text-muted-foreground">
              Number of Zones: {properties.number_zones || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              Square Feet per Zone: {properties.square_feet_zone || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Blocks className="w-6 h-6 text-primary" />
          <div>
            <p className="font-semibold">Heat Elements</p>
            <p className="text-sm text-muted-foreground">
              {properties.heat_elements.length > 0
                ? properties.heat_elements.join(", ")
                : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              Special Application: {properties.special_application}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <p className="font-semibold">Additional Information</p>
            <p className="text-sm text-muted-foreground">
              Notes: {properties.extra_notes || "N/A"}
            </p>
            <div className="flex-col mb-2 text-sm text-muted-foreground">
              Documentation provided:
            </div>
            <div className="flex">{renderDocumentation()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchematicRequestCard;
