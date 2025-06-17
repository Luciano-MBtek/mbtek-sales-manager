import { useState, useEffect } from "react";
import FileInput from "@/components/FileInput";
import { uploadCompleteSystemDocumentation } from "@/app/forms/complete-system-documentation/actions";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FileData {
  id: string;
  name: string;
  url: string;
}

interface DocumentationContent {
  onComplete: (data: any) => void;
  initialData?: FileData[];
  formRef: React.RefObject<HTMLFormElement | null>;
  dealId: string;
}

export default function DocumentationContent({
  onComplete,
  initialData = [],
  formRef,
  dealId,
}: DocumentationContent) {
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setExistingFiles(initialData);
    } else {
      setExistingFiles([]);
    }
  }, [initialData]);

  const handleRemoveFile = (fileId: string) => {
    setExistingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 && existingFiles.length === 0) {
      setError("You must upload at least one file.");
      return;
    }
    setError(undefined);
    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documentation", file);
      });
      formData.append("dealId", dealId);
      formData.append(
        "existingFileIds",
        existingFiles.map((file) => file.id).join(";")
      );

      const result = await uploadCompleteSystemDocumentation(formData);

      if ("success" in result) {
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          });

          // Obtener los nuevos archivos del resultado
          const newFiles = Array.isArray(result.newFiles)
            ? result.newFiles.filter(
                (file): file is FileData =>
                  typeof file === "object" &&
                  "id" in file &&
                  "name" in file &&
                  "url" in file
              )
            : [];
          const updatedFiles = [...existingFiles, ...newFiles];
          setExistingFiles(updatedFiles);

          // Notificar al componente padre con los datos actualizados
          onComplete({
            existingFileIds: updatedFiles.map((file) => file.id),
            files: updatedFiles,
          });

          // Limpiar los archivos temporales después de subir
          setFiles([]);
        } else {
          setError(result.message);
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } else {
        const errorMessage = Object.values(result).join(", ");
        setError(errorMessage);
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file");
      toast({
        title: "Error",
        description: "Error uploading file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">
          Technical documentation provided by the prospect (plans, energy bills,
          photos)
        </h3>
        {existingFiles.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Existing files:</p>
            <div className="flex flex-wrap gap-2">
              {existingFiles.map((file) => (
                <Badge
                  key={file.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    {file.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        <FileInput
          label="Drag files here or click to upload"
          id="documentation"
          errorMsg={error}
          value={
            files.length > 0
              ? files.map((file) => ({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                }))
              : undefined
          }
          multiple
          onChange={(newFiles) => {
            setFiles(newFiles);
            setError(undefined);
          }}
        />
      </div>
      <div className="text-sm text-gray-500">* Required fields</div>
    </form>
  );
}
