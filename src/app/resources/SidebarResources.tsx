"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Calculator,
  MapPin,
  CreditCard,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const resourceItems = [
  /*  {
    title: "Knowledge Base",
    icon: BookOpen,
    path: "/resources/knowledge-base",
  }, */
  {
    title: "Calculators",
    icon: Calculator,
    path: "/resources/calculators",
  },
  {
    title: "Installers Map",
    icon: MapPin,
    path: "",
    onClick: () => {
      window.open(
        "https://www.google.com/maps/d/u/0/viewer?mid=11w8982kwIXNLi-L2iOEByzbrGD_e8Ug&ll=41.271953138759145%2C-80.78441631783622&z=6",
        "_blank"
      );
    },
  },
  {
    title: "Payment Info",
    icon: CreditCard,
    path: "/resources/payment",
  },
  /*  {
    title: "Onboarding Guide",
    icon: FileText,
    path: "/resources/onboarding",
  },
  {
    title: "Sales SOP",
    icon: ClipboardList,
    path: "/resources/sales-sop",
  }, */
];

export function SidebarResources() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleResourceClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("svg")?.classList.contains("chevron")
    ) {
      setIsExpanded(!isExpanded);
      return;
    }
    router.push("/resources");
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleResourceClick}>
          <FileText />
          <span>Resources</span>
          {isExpanded ? (
            <ChevronDown className="ml-auto h-4 w-4" />
          ) : (
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>

      {isExpanded && (
        <div className="ml-4 space-y-1">
          {resourceItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild={!item.onClick}
                onClick={item.onClick}
                className="pl-6"
              >
                {item.onClick ? (
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </div>
                ) : (
                  <Link href={item.path}>
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>
      )}
    </>
  );
}
