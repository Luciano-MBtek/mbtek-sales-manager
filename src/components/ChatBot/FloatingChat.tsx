"use client";

import { useState } from "react";
import { ChatInterface } from "./Chatbotn8n";
import { Button } from "../ui/button";
import { X, BotMessageSquare } from "lucide-react";
import { RainbowButton } from "../magicui/rainbow-button";
import { HyperText } from "../magicui/hyper-text";
import { BorderBeam } from "../magicui/border-beam";
import { Card, CardHeader } from "../ui/card";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-10 right-4 z-50">
      <Card
        className={`w-[500px] h-[700px] bg-white rounded-lg shadow-lg transition-all duration-300 flex flex-col justify-between  ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <CardHeader className=" flex flex-row items-center justify-between p-2 ">
          <HyperText
            className="ml-4 text-xl"
            duration={800}
            animateOnHover={true}
          >
            Mbtek Knowledge Base Assistant
          </HyperText>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <ChatInterface isFloating={true} />

        {isOpen && (
          <BorderBeam
            duration={4}
            size={300}
            reverse
            className="from-transparent via-green-500 to-transparent"
          />
        )}
      </Card>

      <div
        className={`absolute bottom-0 right-5 ${isOpen ? "hidden" : "block"}`}
      >
        <RainbowButton
          className="!h-20 !w-20 !p-0 rounded-full flex items-center justify-center"
          onClick={() => setIsOpen(true)}
        >
          <BotMessageSquare />
        </RainbowButton>
      </div>
    </div>
  );
}
