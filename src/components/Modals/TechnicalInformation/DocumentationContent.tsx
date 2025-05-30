import { useState } from "react";
import FileInput from "@/components/FileInput";

interface DocumentationContent {
  onComplete: (data: any) => void;
  initialData?: any;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function DocumentationContent({
  onComplete,
  initialData = {},
  formRef,
}: DocumentationContent) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("You must upload at least one file.");
      return;
    }
    setError(undefined);
    onComplete({ documentation: file });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">
          Technical documentation provided by the prospect (plans, energy bills,
          photos)
        </h3>
        <FileInput
          label="Drag files here or click to upload"
          id="documentation"
          errorMsg={error}
          value={
            file
              ? { name: file.name, type: file.type, size: file.size }
              : undefined
          }
          onChange={(f) => {
            setFile(f);
            setError(undefined);
          }}
        />
      </div>
      <div className="text-sm text-gray-500">* Required fields</div>
    </form>
  );
}
