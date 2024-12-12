import { MessageCircleMore } from "lucide-react";

interface FormQuestionProps {
  question: string;
}

export default function FormQuestion({ question }: FormQuestionProps) {
  return (
    <div className="flex gap-2 text-lg">
      <MessageCircleMore
        className="flex-shrink-0"
        width={24}
        height={24}
        color="black"
      />
      <p className="text-black">{question}</p>
    </div>
  );
}
