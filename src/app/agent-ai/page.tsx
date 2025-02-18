import { Metadata } from "next";
import { ChatInterface } from "@/components/ChatBot/Chatbotn8n";
export const metadata: Metadata = {
  title: "AI agent",
  description: "Chat with MBtek's knowledgebase.",
};

const page = () => {
  return (
    <div className="flex w-full  flex-col">
      <ChatInterface isFloating={false} />
    </div>
  );
};

export default page;
