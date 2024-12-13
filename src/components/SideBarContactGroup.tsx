"use client";
import {
  ChevronRight,
  CircleUser,
  NotepadText,
  Table,
  UserRoundCheck,
  Box,
  MoreHorizontal,
  Trash,
  Proportions,
  Handshake,
  PencilRuler,
  Quote,
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
import SideBarAddToFavourite from "./SideBarAddToFavourite";
import { useEffect, useState } from "react";
import { checkContactFav } from "@/actions/contact/checkContactFav";
import { Session } from "next-auth";

interface SideBarContactGroupProps {
  session: Session | null;
}

const SideBarContactGroup = ({ session }: SideBarContactGroupProps) => {
  const { contact, update, clear } = useContactStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFav, setIsCheckingFav] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  console.log(session);

  useEffect(() => {
    const checkFavorite = async () => {
      if (contact?.id) {
        setIsCheckingFav(true);
        const isContactFav = await checkContactFav(contact.id);
        setIsFavorite(isContactFav);
        setIsCheckingFav(false);
      }
    };
    checkFavorite();
  }, [contact?.id]);

  useEffect(() => {
    if (!session) {
      clear();
    }
  }, [session, clear]);

  if (!contact) return null;

  const { id, firstname, lastname, areDeals, hasSchematic, hasQuotes } =
    contact;

  const propertiesPath = `/contacts/${id}/properties`;
  const dealsPath = `/contacts/${id}/deals`;
  const schematicPath = `/contacts/${id}/schematic`;
  const quotesPath = `/contacts/${id}/quotes`;
  const mainPath = `/contacts/${id}`;
  const isPropertiesActive = pathname === propertiesPath;
  const isMainActive = pathname === mainPath;
  const isDealsActive = pathname === dealsPath;
  const isSchematicActive = pathname === schematicPath;
  const isQuotesPathActive = pathname === quotesPath;
  const isTechAgent = session?.user?.accessLevel === "schematic_team";

  const items = [
    {
      title: "Lead Qualification",
      url: "/forms/discovery-lead/step-one",
      icon: UserRoundCheck,
    },
    {
      title: "Single Product Quote",
      url: "/forms/single-product/step-one",
      icon: Box,
    },
    {
      title: "Schematic Request",
      url: "/forms/schematic-request",
      icon: Proportions,
    },
  ];

  const techAgentItems = [
    {
      title: "Schematic Upload",
      url: "/forms/schematic-upload",
      icon: Proportions,
    },
  ];

  const handleClearContact = () => {
    router.push("/contacts");
    clear();
  };

  const displayItems = isTechAgent ? techAgentItems : items;

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
              <SideBarAddToFavourite
                contact={contact}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                isLoading={isCheckingFav}
              />
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
        {areDeals && (
          <SidebarMenuItem>
            {isDealsActive ? (
              <SidebarMenuButton isActive={true}>
                <Handshake />
                <span>Deals</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild>
                <Link
                  href={{
                    pathname: dealsPath,
                  }}
                >
                  <Handshake />
                  <span>Deals</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        )}
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

        {hasQuotes && (
          <SidebarMenuItem>
            {isQuotesPathActive ? (
              <SidebarMenuButton isActive={true}>
                <Quote />
                <span>Quotes</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild>
                <Link
                  href={{
                    pathname: quotesPath,
                  }}
                >
                  <Quote />
                  <span>Quotes</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        )}

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
  );
};

export default SideBarContactGroup;
