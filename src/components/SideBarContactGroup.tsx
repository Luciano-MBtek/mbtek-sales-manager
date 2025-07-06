"use client";
import {
  ChevronRight,
  CircleUser,
  Table,
  Box,
  MoreHorizontal,
  Proportions,
  Handshake,
  PencilRuler,
  MessagesSquare,
  X,
  Boxes,
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

import { useEffect } from "react";

import { Session } from "next-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import EmailModal from "./Email/EmailModal";

interface SideBarContactGroupProps {
  session: Session | null;
}

const SideBarContactGroup = ({ session }: SideBarContactGroupProps) => {
  const { contact, clear } = useContactStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      clear();
    }
  }, [session, clear]);

  if (!contact) return null;

  const { id, firstname, lastname, hasSchematic } = contact;

  const propertiesPath = `/contacts/${id}/properties`;
  const schematicPath = `/contacts/${id}/schematic`;
  const engagementsPath = `/contacts/${id}/engagements`;
  const mainPath = `/contacts/${id}`;
  const isPropertiesActive = pathname === propertiesPath;
  const isMainActive = pathname === mainPath;
  const isSchematicActive = pathname === schematicPath;
  const isEngagementsPathActive = pathname === engagementsPath;
  const isTechAgent = session?.user?.accessLevel === "schematic_team";

  const items = [
    {
      title: "Complete System",
      url: `/deals/complete-system/${id}`,
      icon: Boxes,
    },
    {
      title: "Quick quote",
      url: `/deals/quick-quote/${id}`,
      icon: Box,
    },

    {
      title: "Schematic Request",
      url: "/deals/schematic-request",
      icon: Proportions,
    },
  ];

  const techAgentItems = [
    {
      title: "Schematic Upload",
      url: "/deals/schematic-upload",
      icon: Proportions,
    },
  ];

  const handleClearContact = () => {
    router.push("/contacts");
    clear();
  };

  const displayItems = isTechAgent ? techAgentItems : items;

  return (
    <>
      <div className="h-px bg-border my-2 mx-4" />
      <div className="p-2">
        <SidebarGroup className="bg-background rounded-lg">
          <SidebarGroupLabel className="flex items-center justify-between">
            <span className="text-blue-500 text-base">{`${firstname} ${lastname ?? ""}`}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleClearContact}
                    className="p-1 rounded-lg hover:bg-muted bg-background"
                    aria-label="Clear contact"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={10} side="right">
                  Just clears the contact from the sidebar, it does not delete.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                  <EmailModal isSideBar={true} />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {isEngagementsPathActive ? (
                <SidebarMenuButton isActive={true}>
                  <MessagesSquare />
                  <span>Engagements</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild>
                  <Link
                    href={{
                      pathname: engagementsPath,
                    }}
                  >
                    <MessagesSquare />
                    <span>Engagements</span>
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
                    }}
                  >
                    <Table />
                    <span>Properties</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>

            {hasSchematic && (
              <SidebarMenuItem>
                {isSchematicActive ? (
                  <SidebarMenuButton isActive={true}>
                    <PencilRuler />
                    <span>Schematic</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild>
                    <Link
                      href={{
                        pathname: schematicPath,
                      }}
                    >
                      <PencilRuler />
                      <span>Schematic</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            )}

            <Collapsible defaultOpen={true}>
              <CollapsibleTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Handshake />
                    Deals
                  </SidebarMenuButton>
                  <SidebarMenuAction className="transition-transform duration-200 data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle deals</span>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {displayItems.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={{
                            pathname: item.url,
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
      </div>
    </>
  );
};

export default SideBarContactGroup;
