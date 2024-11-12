"use client";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname, useSearchParams } from "next/navigation";

const SideBarContactGroup = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const lastname = searchParams.get("lastname");

  const showContactGroup = pathname?.match(/^\/contacts\/[^/]+$/);
  if (!showContactGroup) return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Contact {`${name} ${lastname}`}</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <SidebarMenuItem>
              <SidebarMenuButton>Forms</SidebarMenuButton>
              <SidebarMenuAction className="transition-transform duration-200 data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle Forms</span>
              </SidebarMenuAction>
            </SidebarMenuItem>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton>Contact Form</SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton>Feedback Form</SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
        <SidebarMenuItem>
          <SidebarMenuButton>Properties</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SideBarContactGroup;
