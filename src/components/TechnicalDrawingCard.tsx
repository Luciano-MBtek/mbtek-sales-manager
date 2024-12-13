"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Download } from "lucide-react"; // Asegúrate de importar el icono

interface TechnicalDrawingProps {
  technicalDrawing: string;
}

const TechnicalDrawingCard = ({ technicalDrawing }: TechnicalDrawingProps) => {
  const getFileType = (url: string) => {
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

  const fileType = getFileType(technicalDrawing);

  if (!fileType) return <div>Formato no soportado</div>;

  if (fileType === "application/pdf") {
    return (
      <div className="relative w-full max-w-4xl m-2">
        <div className="absolute top-2 right-2 z-10">
          <a
            href={technicalDrawing}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </a>
        </div>
        <iframe
          src={technicalDrawing}
          className="w-full h-[600px]"
          title="PDF Viewer"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <Image
        src={technicalDrawing}
        alt="Technical Drawing"
        width={800}
        height={600}
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default TechnicalDrawingCard;
