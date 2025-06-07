"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { TaskNotifications } from "@/components/TaskNotifications";

import { SearchInput } from "@/components/SearchInput";

export function AppHeader() {
  const { data: session } = useSession();

  const title =
    session?.user?.accessLevel === "sales_agent" ||
    session?.user?.accessLevel === "manager"
      ? "Sales Closer Dashboard"
      : "Lead Qualification Dashboard";

  return (
    <header className="flex fixed items-center justify-between w-full border-b bg-background/80 backdrop-blur-sm px-4 py-2 max-h-[--header-height] z-[9999]">
      <div className="flex items-center gap-3">
        <Image src="/Logo_Vector.png" alt="Logo" width={120} height={40} />
        <div className="h-8 w-px bg-border"></div>
        <h1 className="text-lg font-semibold whitespace-nowrap">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <SearchInput />
        <TaskNotifications />
      </div>
    </header>
  );
}
