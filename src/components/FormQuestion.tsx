import { MessageCircleMore } from "lucide-react";

interface FormQuestionProps {
  question: string;
}

export default function FormQuestion({ question }: FormQuestionProps) {
  return (
    <div className="flex gap-2 text-lg">
      <p className="text-black">{question}</p>
    </div>
  );
}
