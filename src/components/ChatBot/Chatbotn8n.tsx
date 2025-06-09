"use client";

import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { DotPattern } from "../magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatbot-store";
import { sendChatbotMessage } from "@/components/ChatBot/chatbot-service";
import { ChatInfoGraphic } from "./ChatInfoGraphic";
import { AnimatePresence, motion } from "framer-motion";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatInterface = ({
  isFloating = false,
}: {
  isFloating?: boolean;
}) => {
  const { messages, isLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showInfoGraphic, setShowInfoGraphic] = useState(true);

  const { data: session } = useSession();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowInfoGraphic(false);
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    setShowInfoGraphic(false);
    await sendChatbotMessage(message, session?.user?.hubspotOwnerId);
  };

  const handleCloseInfoGraphic = () => {
    setShowInfoGraphic(false);
  };

  const handleOpenInfoGraphic = () => {
    setShowInfoGraphic(true);
  };

  return (
    <>
      <div
        className={`bg-white shadow-sm w-full ${isFloating ? "h-[600px]" : "h-full"} flex flex-col rounded-b-lg`}
      >
        <div
          className={`${isFloating ? "h-full" : "h-[90vh]"} overflow-y-auto p-4 relative flex-1`}
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

          {!showInfoGraphic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              {...{ className: "absolute top-2 right-2 z-30" }}
            >
              <Button
                onClick={handleOpenInfoGraphic}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full relative group overflow-hidden bg-gradient-to-r from-purple-500/10 to-orange-500/10 border-purple-200 hover:border-purple-300 hover:from-purple-500/20 hover:to-orange-500/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <InfoIcon className="h-6 w-6 text-mbtek group-hover:text-orange-600 transition-colors" />
              </Button>
            </motion.div>
          )}

          <div className="space-y-4">
            <AnimatePresence>
              {showInfoGraphic && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ChatInfoGraphic onClose={handleCloseInfoGraphic} />
                </motion.div>
              )}
            </AnimatePresence>

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
