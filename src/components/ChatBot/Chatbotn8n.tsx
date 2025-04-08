"use client";

import { useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { DotPattern } from "../magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatbot-store";
import { sendChatbotMessage } from "@/components/ChatBot/chatbot-service";

export const ChatInterface = ({
  isFloating = false,
}: {
  isFloating?: boolean;
}) => {
  const { messages, isLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    await sendChatbotMessage(message, session?.user?.hubspotOwnerId);
  };

  return (
    <>
      <div
        className={`bg-white shadow-sm w-full ${isFloating ? "h-[600px]" : "h-full"} flex flex-col rounded-b-lg`}
      >
        <div
          className={`${
            isFloating ? "h-full" : "h-[90vh]"
          } overflow-y-auto p-4 relative flex-1`}
        >
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className={cn(
              "[mask-image:linear-gradient(to_bottom_left,white,transparent_70%,transparent)] p-2 absolute"
            )}
          />
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
            {isLoading && <ChatMessage message="..." isUser={false} />}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};
