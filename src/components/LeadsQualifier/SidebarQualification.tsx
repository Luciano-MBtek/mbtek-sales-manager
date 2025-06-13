"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ListTodo, PlusCircle } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const qualificationItems = [
  {
    title: "New Qualification",
    path: "/active-qualifications?startQualification=true",
    icon: PlusCircle,
  },
];

export function SidebarQualification() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleQualificationClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("svg")?.classList.contains("chevron")
    ) {
      setIsExpanded(!isExpanded);
      return;
    }
    router.push("/active-qualifications");
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleQualificationClick}>
          <ListTodo />
          <span>Qualification</span>
          {isExpanded ? (
            <ChevronDown className="ml-auto h-4 w-4 chevron" />
          ) : (
            <ChevronRight className="ml-auto h-4 w-4 chevron" />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>

      {isExpanded && (
        <div className="ml-4 space-y-1">
          {qualificationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="pl-6">
                <Link href={item.path}>
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>
      )}
    </>
  );
}
