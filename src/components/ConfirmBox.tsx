import { CircleCheck } from "lucide-react";

interface ConfirmBoxProp {
  text: string;
}

export default function ConfirmBox({ text }: ConfirmBoxProp) {
  return (
    <div className="border-eborder rounded-lg border-success border px-4 py-3">
      <p className="text-sm">
        <CircleCheck
          className="-mt-0.5 me-3 inline-flex text-emerald-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        {text}
      </p>
    </div>
  );
}
