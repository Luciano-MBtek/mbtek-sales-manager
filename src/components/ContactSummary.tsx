import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ContactOwnerCard = ({
  contactSummary,
}: {
  contactSummary: string | null;
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center">
          Contact Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReactMarkdown
          className="prose dark:prose-invert 
          prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
          prose-h4:text-sm prose-h5:text-sm prose-h6:text-sm
          max-w-none"
          remarkPlugins={[remarkGfm]}
        >
          {contactSummary || ""}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default ContactOwnerCard;
