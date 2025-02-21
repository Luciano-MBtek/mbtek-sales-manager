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
  MessagesSquare,
  Mail,
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
  const { contact, update, clear } = useContactStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCheckingFav, setIsCheckingFav] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkFavorite = async () => {
      if (contact?.id && session) {
        setIsCheckingFav(true);
        try {
          const isContactFav = await checkContactFav(contact.id);
          setIsFavorite(isContactFav);
        } catch (error) {
          console.error("Error checking favorite:", error);
          setIsFavorite(false);
        } finally {
          setIsCheckingFav(false);
        }
      }
    };
    checkFavorite();
  }, [contact?.id, session]);

  useEffect(() => {
    if (!session) {
      clear();
    }
  }, [session, clear]);

  if (!contact) return null;

  const {
    id,
    firstname,
    lastname,
    areDeals,
    hasSchematic,
    hasQuotes,
    wantsCompleteSystem,
  } = contact;

  const propertiesPath = `/contacts/${id}/properties`;
  const dealsPath = `/contacts/${id}/deals`;
  const schematicPath = `/contacts/${id}/schematic`;
  const quotesPath = `/contacts/${id}/quotes`;
  const engagementsPath = `/contacts/${id}/engagements`;
  const mainPath = `/contacts/${id}`;
  const isPropertiesActive = pathname === propertiesPath;
  const isMainActive = pathname === mainPath;
  const isDealsActive = pathname === dealsPath;
  const isSchematicActive = pathname === schematicPath;
  const isQuotesPathActive = pathname === quotesPath;
  const isEngagementsPathActive = pathname === engagementsPath;
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
    ...(wantsCompleteSystem
      ? [
          {
            title: "Complete System",
            url: "/forms/complete-system/step-one",
            icon: MessagesSquare,
          },
        ]
      : []),
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
        Contact {`${firstname} ${lastname ?? ""}`}
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

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <EmailModal isSideBar={true} />
              </DropdownMenuItem>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem
                      className="hover:bg-red-300 dark:hover:bg-red-800 focus:bg-red-300 dark:focus:bg-red-800"
                      onClick={handleClearContact}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span>Clear Contact</span>
                        <Trash width={15} />
                      </div>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={10} side="right">
                    Just clears the contact from the sidebar, it does not
                    delete.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
