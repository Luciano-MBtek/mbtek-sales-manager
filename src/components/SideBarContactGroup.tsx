"use client";
import {
  ChevronRight,
  CircleUser,
  NotepadText,
  Table,
  UserRoundCheck,
  Box,
  MoreHorizontal,
  Star,
  Trash,
  Proportions,
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
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useContactStore } from "@/store/contact-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const SideBarContactGroup = () => {
  const { contact, clear } = useContactStore();
  const pathname = usePathname();
  const router = useRouter();

  if (!contact) return null;

  const {
    id,
    firstname,
    lastname,
    email,
    leadStatus,
    country,
    state,
    province,
  } = contact;

  const propertiesPath = `/contacts/${id}/properties`;
  const mainPath = `/contacts/${id}`;
  const formPath = `/forms`;
  const isPropertiesActive = pathname === propertiesPath;
  const isMainActive = pathname === mainPath;

  const items = [
    {
      title: "Lead Qualification",
      url: "/forms/discovery-lead/step-one",
      icon: UserRoundCheck,
      params: {
        id,
        name: firstname,
        lastname,
        email,
        country,
        state,
        province,
      },
    },
    {
      title: "Single Product Quote",
      url: "/forms/single-product/step-one",
      icon: Box,
      params: {
        id,
        name: firstname,
        lastname,
        email,
        country,
        state,
        province,
      },
    },
    {
      title: "Schematic Request",
      url: "/forms/schematic-request",
      icon: Proportions,
      params: {
        id,
        name: firstname,
        lastname,
        email,
        country,
        state,
        province,
      },
    },
  ];

  const handleClearContact = () => {
    router.push("/contacts");
    clear();
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Contact {`${firstname} ${lastname}`}
      </SidebarGroupLabel>

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
                }}
              >
                <CircleUser />
                <span>Main</span>
              </Link>
            </SidebarMenuButton>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction>
                <MoreHorizontal />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem>
                <div className="flex w-full items-center justify-between gap-2">
                  <span>Add to Favourites</span>
                  <Star width={15} />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClearContact}>
                <div className="flex w-full items-center justify-between gap-2">
                  <span>Clear Contact</span>
                  <Trash width={15} />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <SidebarMenuSub>
              {items.map((item) => (
                <SidebarMenuSubItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={{
                        pathname: item.url,
                        query: item.params,
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SideBarContactGroup;
