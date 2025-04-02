"use client";

import {
  Home,
  Search,
  LayoutDashboard,
  MonitorCog,
  UserPlus,
  Handshake,
  BotMessageSquare,
  CircleUserRound,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavUser from "./SideBarFooter";
import SideBarContactGroup from "./SideBarContactGroup";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { useContactStore } from "@/store/contact-store";
import { SidebarResources } from "@/app/resources/SidebarResources";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "New Process",
    url: "/forms/discovery-lead",
    icon: UserPlus,
    requireAuth: true,
    requireRole: ["admin", "owner", "manager"],
  },
  {
    title: "Search Contacts",
    url: "/contacts",
    requireAuth: true,
    icon: Search,
  },
  {
    title: "AI chat (Beta)",
    url: "/agent-ai",
    icon: BotMessageSquare,
    requireAuth: true,
  },
  {
    title: "My Meetings",
    url: "/my-meetings",
    icon: Calendar,
    requireAuth: true,
  },
  {
    title: "User Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    requireAuth: true,
  },
  {
    title: "My Deals",
    url: "/mydeals",
    icon: Handshake,
    requireAuth: true,
  },
  {
    title: "My Contacts",
    url: "/my-contacts",
    icon: CircleUserRound,
    requireAuth: true,
  },

  {
    title: "Admin Dashboard",
    url: "/admin-dashboard",
    icon: MonitorCog,
    requireAuth: true,
    requireRole: ["admin", "owner"],
  },
];

export function AppSidebar() {
  const { data: session, status } = useSession();
  const clearContact = useContactStore((state) => state.clear);

  if (status === "loading") {
    return null;
  }

  const filteredItems = items.filter((item) => {
    if (!item.requireAuth) return true;

    if (!session) return false;

    if (item.requireRole) {
      return item.requireRole.includes(session?.user?.accessLevel as Role);
    }

    return true;
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sales Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={
                        item.url +
                        (item.title === "New Process"
                          ? "/step-one?reset=true"
                          : "")
                      }
                      onClick={() => {
                        if (item.title === "New Process") {
                          clearContact();
                        }
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {session?.user?.accessLevel &&
                ["admin", "owner", "manager"].includes(
                  session.user.accessLevel
                ) && <SidebarResources />}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Group for Contact Lead */}
        <SideBarContactGroup session={session} />
        {/* --------- */}
      </SidebarContent>
      <SidebarFooter>
        {/* User */}
        <NavUser session={session} status={status} />
        {/* --------- */}
      </SidebarFooter>
    </Sidebar>
  );
}
