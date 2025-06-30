"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

const pipelines = [
  { label: "Both Pipelines", value: "all" },
  { label: "Mbtek - Complete System", value: "732661879" },
  { label: "Mbtek - Instant Quote", value: "732682097" },
];

export function PipelineSelect({
  onPipelineChange,
}: {
  onPipelineChange?: (pipeline: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selected = searchParams.get("pipeline") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("pipeline");
    else params.set("pipeline", value);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
      router.refresh();
    });
    if (onPipelineChange) {
      onPipelineChange(value);
    }
  };

  const display =
    pipelines.find((p) => p.value === selected)?.label || "Both Pipelines";

  return (
    <Select value={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        <SelectValue>{display}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {pipelines.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
