"use client";

import {
  Home,
  Search,
  LayoutDashboard,
  MonitorCog,
  Handshake,
  BotMessageSquare,
  CircleUserRound,
  Calendar,
  ListTodo,
  Activity,
} from "lucide-react";
import Shopify from "./Icons/Shopify";

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

import { SidebarResources } from "@/app/resources/SidebarResources";

const items = [
  {
    title: "Overview",
    url: "/",
    icon: Home,
  },
  {
    title: "Active Qualifications",
    url: "/active-qualifications",
    icon: ListTodo,
    requireAuth: true,
    requireRole: ["owner", "lead_agent"],
  },
  {
    title: "Activities",
    url: "/activities",
    icon: Activity,
    requireAuth: true,
    requireRole: ["owner", "lead_agent"],
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
    requireRole: ["admin", "owner", "sales_agent", "manager"],
  },
  {
    title: "My Deals",
    url: "/mydeals",
    icon: Handshake,
    requireAuth: true,
    requireRole: ["admin", "owner", "sales_agent", "manager"],
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
  {
    title: "Products",
    url: "/products",
    icon: Shopify,
    requireAuth: true,
  },
];

export function AppSidebar() {
  const { data: session, status } = useSession();

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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {session?.user?.accessLevel &&
                [
                  "admin",
                  "owner",
                  "manager",
                  "sales_agent",
                  "lead_agent",
                ].includes(session.user.accessLevel) && <SidebarResources />}
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
