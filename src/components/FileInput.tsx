import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";
import { Upload, File as FileIcon } from "lucide-react";

interface FileInputProps {
  label: string;
  id: string;
  errorMsg?: string;
  description?: string;
  className?: string;
  value?: {
    name: string;
    type: string;
    size: number;
    buffer?: Buffer;
  };
  onChange: (file: File) => void;
}

export default function FileInput({
  label,
  id,
  errorMsg,
  onChange,
  description,
  value,
}: FileInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="relative">
        <Input
          id={id}
          name={id}
          type="file"
          onChange={handleChange}
          accept=".pdf,.jpeg,.jpg,.png,.svg"
          className="w-full cursor-pointer opacity-0 absolute inset-0 z-10"
        />
        <div
          className={`flex items-center justify-center w-full px-6 py-4 text-sm border-2 border-dashed rounded-md ${
            errorMsg ? "border-destructive" : "border-input"
          } hover:border-primary`}
        >
          {value && value.name ? (
            <>
              <FileIcon className="w-6 h-6 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">{value.name}</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                Choose a file or drag and drop here
              </span>
            </>
          )}
        </div>
      </div>

      <div className="min-h-[1rem]">
        {errorMsg && (
          <span className="text-sm text-destructive">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
