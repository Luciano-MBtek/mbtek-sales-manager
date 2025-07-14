"use client";

import Image from "next/image";
import { TaskNotifications } from "@/components/TaskNotifications";

import { SearchInput } from "@/components/SearchInput";

import { Bot, Sparkles, Bug } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useState } from "react";
import BugModal from "./BugReport/BugModal";
import { User } from "@prisma/client";
import TeamSwitcher from "@/app/admin-dashboard/components/team-switcher";
import { Session } from "next-auth";

export function AppHeader({
  users,
  session,
}: {
  users: User[];
  session: Session | null;
}) {
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  const accessLevel = session?.user?.accessLevel;

  const title =
    accessLevel === "sales_agent" || accessLevel === "manager"
      ? "Sales Closer Dashboard"
      : accessLevel === "admin" || accessLevel === "owner"
        ? "Admin View"
        : "Lead Qualification Dashboard";

  const handleAIClick = () => {
    window.open("/agent-ai", "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <header className="flex fixed items-center justify-between w-full border-b bg-background/80 backdrop-blur-sm p-8 max-h-[--header-height] z-[9998]">
        <div className="flex items-center gap-3">
          <Image src="/Logo_Vector.png" alt="Logo" width={120} height={40} />
          <div className="h-8 w-px bg-border"></div>
          <h1 className="text-lg font-semibold whitespace-nowrap">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {accessLevel === "admin" || accessLevel === "owner" ? (
            <TeamSwitcher users={users} />
          ) : null}
          {/* button that opens new tab to  /agent-ai */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsBugModalOpen(true)}
                  className="p-2"
                >
                  <Bug className="h-5 w-5" />
                  <span className="sr-only">Report Bug</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Report bug</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAIClick}
                  variant="outline"
                  size="sm"
                  className="relative group overflow-hidden bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 hover:border-purple-300 hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-2">
                    <Bot className="h-4 w-4 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      AI Assistant
                    </span>
                    <Sparkles className="h-3 w-3 text-blue-500 group-hover:text-blue-600 transition-colors animate-pulse" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>MBtek AI assitant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SearchInput />
          <TaskNotifications />
        </div>
      </header>
      <BugModal
        isSideBar={true}
        isOpen={isBugModalOpen}
        onOpenChange={setIsBugModalOpen}
      />
    </>
  );
}
