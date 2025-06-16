"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  FileText,
  MessageSquareText,
  MessagesSquare,
  Loader2,
} from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const activitiesItems = [
  {
    title: "Calls",
    path: "/engagements?filter=calls",
    icon: Phone,
    filter: "Call",
  },
  {
    title: "Emails",
    path: "/engagements?filter=emails",
    icon: Mail,
    filter: "Email",
  },
  {
    title: "Notes",
    path: "/engagements?filter=notes",
    icon: FileText,
    filter: "Note",
  },
  {
    title: "SMS",
    path: "/engagements?filter=sms",
    icon: MessageSquareText,
    filter: "SMS",
  },
];

export function SidebarActivities() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter");

  useEffect(() => {
    if (currentFilter) {
      setOpen(true);
    }
  }, [currentFilter]);

  useEffect(() => {
    setLoading(null);
  }, [pathname, searchParams]);

  const handleActivitiesClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("svg")?.classList.contains("chevron")
    ) {
      return;
    }
    router.push("/engagements");
  };

  return (
    <>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleActivitiesClick}>
              <MessagesSquare />
              <span>Engagements</span>
              <ChevronRight className="ml-auto h-4 w-4 chevron transition-transform duration-200 data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </CollapsibleTrigger>

        <CollapsibleContent asChild>
          <SidebarMenuSub>
            <div className=" space-y-1">
              {activitiesItems.map((item) => (
                <SidebarMenuSubItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`pl-6 ${
                      currentFilter === item.path.split("=")[1]
                        ? "bg-muted"
                        : ""
                    }`}
                    onClick={() => {
                      setLoading(item.filter);
                      router.push(item.path);
                    }}
                  >
                    <Link href={item.path} onClick={(e) => e.preventDefault()}>
                      {loading === item.filter ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <item.icon className="h-4 w-4 mr-2" />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              ))}
            </div>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
