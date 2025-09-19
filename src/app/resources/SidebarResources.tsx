"use client";

import { useState } from "react";
import {
  ChevronRight,
  FileText,
  Calculator,
  MapPin,
  CreditCard,
  Wrench,
  Table2,
} from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Shopify from "@/components/Icons/Shopify";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ResourceItem {
  title: string;
  path: string;
  icon: any;
  onClick?: () => void;
}

const productsItems: ResourceItem[] = [
  {
    title: "Products",
    path: "/products",
    icon: Shopify,
  },
];

const toolsItems: ResourceItem[] = [
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
  {
    title: "Orders",
    icon: Table2,
    path: "/resources/orders",
  },
];

export function SidebarResources() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleResourceClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("svg")?.classList.contains("chevron")
    ) {
      return;
    }
    router.push("/resources");
  };

  return (
    <>
      <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleResourceClick}>
              <FileText />
              <span>Resources</span>
              <ChevronRight className="ml-auto h-4 w-4 chevron transition-transform duration-200 data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </CollapsibleTrigger>

        <CollapsibleContent asChild>
          <SidebarMenuSub>
            <div className="space-y-1">
              {productsItems.map((item) => (
                <SidebarMenuSubItem key={item.title}>
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
                </SidebarMenuSubItem>
              ))}

              <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuSubItem>
                    <SidebarMenuButton className="pl-6">
                      <Wrench className="h-4 w-4 mr-2" />
                      <span>Tools</span>
                      <ChevronRight className="ml-auto h-4 w-4 chevron transition-transform duration-200 data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="space-y-1">
                    {toolsItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuButton
                          asChild={!item.onClick}
                          onClick={item.onClick}
                          className="pl-12"
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
                      </SidebarMenuSubItem>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
