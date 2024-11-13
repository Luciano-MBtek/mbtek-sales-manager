"use client";
import {
  ChevronRight,
  CircleUser,
  NotepadText,
  Table,
  UserRoundCheck,
  Box,
} from "lucide-react";
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
import Link from "next/link";

const SideBarContactGroup = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showContactGroup = pathname?.match(/^\/contacts\/[^/]+/);
  if (!showContactGroup) return null;

  const contactPath = "/contacts/";
  const id = pathname.slice(contactPath.length).split("/")[0];
  const name = searchParams.get("name");
  const lastname = searchParams.get("lastname");

  const propertiesPath = `/contacts/${id}/properties`;
  const mainPath = `/contacts/${id}`;
  const isPropertiesActive = pathname === propertiesPath;
  const isMainActive = pathname === mainPath;

  console.log(propertiesPath);
  const items = [
    {
      title: "Lead Qualification",
      url: "/forms/discovery-lead",
      icon: UserRoundCheck,
    },
    {
      title: "Single Product Quote",
      url: "/forms/single-product",
      icon: Box,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Contact {`${name} ${lastname}`}</SidebarGroupLabel>

      <SidebarMenu>
        <SidebarMenuItem>
          {isMainActive ? (
            <SidebarMenuButton isActive={true}>
              <CircleUser />
              <span>Main</span>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton asChild>
              <Link
                href={{
                  pathname: mainPath,
                  query: { name, lastname },
                }}
              >
                <CircleUser />
                <span>Main</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
        <SidebarMenuItem>
          {isPropertiesActive ? (
            <SidebarMenuButton isActive={true}>
              <Table />
              <span>Properties</span>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton asChild>
              <Link
                href={{
                  pathname: propertiesPath,
                  query: { name, lastname },
                }}
              >
                <Table />
                <span>Properties</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger asChild>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <NotepadText />
                Forms
              </SidebarMenuButton>
              <SidebarMenuAction className="transition-transform duration-200 data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle Forms</span>
              </SidebarMenuAction>
            </SidebarMenuItem>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SideBarContactGroup;
