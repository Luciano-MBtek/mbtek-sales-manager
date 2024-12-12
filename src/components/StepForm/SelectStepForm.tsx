import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface SelectInputProps {
  label: string;
  id: string;
  options: { label: string; value: string }[];
  placeholder: string;
  errorMsg?: string;
  value: string;
  onChange: (value: string) => void;
  dataLoaded?: boolean;
}

export default function SelectInput({
  label,
  id,
  options,
  placeholder,
  errorMsg,
  value,
  onChange,
  dataLoaded = true,
}: SelectInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="block text-zinc-700 text-md" htmlFor={id}>
        {label}
      </Label>
      {!dataLoaded && <Skeleton className="w-full h-12 rounded-md" />}
      {dataLoaded && (
        <Select onValueChange={onChange} name={id} value={value || undefined}>
          <SelectTrigger
            id={id}
            className={`w-full rounded-md py-4 px-2 text-slate-900 border-2 ${
              errorMsg ? "border-red-500" : "border-slate-300"
            }`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
