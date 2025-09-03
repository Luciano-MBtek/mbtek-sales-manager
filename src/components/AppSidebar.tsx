"use client";

import {
  Home,
  LayoutDashboard,
  MonitorCog,
  Handshake,
  CircleUserRound,
  Calendar,
  ListTodo,
  ListChecks,
  ChartLine,
  MessagesSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
import { SidebarSkeleton } from "./SidebarSkeleton";
import { SidebarQualification } from "./LeadsQualifier/SidebarQualification";
import { SidebarActivities } from "./LeadActivities/SidebarActivities";

const items = [
  {
    title: "Overview",
    url: "/",
    icon: Home,
  },
  {
    title: "My Meetings",
    url: "/my-meetings",
    icon: Calendar,
    requireAuth: true,
  },
  {
    title: "Qualification",
    url: "/active-qualifications",
    icon: ListTodo,
    requireAuth: true,
    requireRole: ["owner", "lead_agent", "admin", "sales_agent"],
  },
  {
    title: "My Tasks",
    url: "/tasks",
    icon: ListChecks,
    requireAuth: true,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartLine,
    requireAuth: true,
    requireRole: ["owner", "lead_agent", "admin"],
  },

  /* {
    title: "User Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    requireAuth: true,
    requireRole: ["admin", "owner"],
  }, */
  {
    title: "My Deals",
    url: "/mydeals",
    icon: Handshake,
    requireAuth: true,
    requireRole: ["admin", "owner", "sales_agent"],
  },
  {
    title: "My Contacts",
    url: "/my-contacts",
    icon: CircleUserRound,
    requireAuth: true,
    requireRole: ["admin", "owner", "sales_agent"],
  },
  {
    title: "Engagements",
    url: "/engagements",
    icon: MessagesSquare,
    requireAuth: true,
    requireRole: ["owner", "lead_agent", "sales_agent", "admin"],
  },
  /*  {
    title: "Admin Dashboard",
    url: "/admin-dashboard",
    icon: MonitorCog,
    requireAuth: true,
    requireRole: ["admin", "owner"],
  }, */
];

export function AppSidebar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <SidebarSkeleton />;
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
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) =>
                item.title === "Qualification" ? (
                  session?.user?.accessLevel &&
                  ["owner", "lead_agent", "admin", "sales_agent"].includes(
                    session.user.accessLevel
                  ) && <SidebarQualification key={item.title} />
                ) : item.title === "Engagements" ? (
                  session?.user?.accessLevel &&
                  ["owner", "lead_agent", "sales_agent", "admin"].includes(
                    session.user.accessLevel
                  ) && <SidebarActivities key={item.title} />
                ) : (
                  // Para los demás ítems, renderizamos normalmente
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
              <SidebarResources />
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
