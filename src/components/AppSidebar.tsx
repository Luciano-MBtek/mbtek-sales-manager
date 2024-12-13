"use client";

import {
  Home,
  Search,
  LayoutDashboard,
  MonitorCog,
  UserPlus,
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
  },
  {
    title: "Search Contacts",
    url: "/contacts",
    icon: Search,
  },
  {
    title: "User Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
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

  if (status === "loading") {
    return null;
  }

  const filteredItems = items.filter((item) => {
    if (!item.requireAuth) return true;

    if (!session) return false;

    if (item.requireRole) {
      return item.requireRole.includes(session?.user?.accessLevel as string);
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Group for Contact Lead */}
        <SideBarContactGroup session={session} />
        {/* --------- */}
      </SidebarContent>
      <SidebarFooter>
        {/* User */}
        <NavUser />
        {/* --------- */}
      </SidebarFooter>
    </Sidebar>
  );
}
