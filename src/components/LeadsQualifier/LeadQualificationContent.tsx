// components/LeadsQualifier/LeadQualificationContent.tsx  (CLIENT component)
"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LeadCard } from "./LeadQualificationCard";
import { Button } from "../ui/button";
import {
  ArrowDown,
  ArrowUp,
  BoxIcon,
  Calendar,
  LayersIcon,
} from "lucide-react";
import { ContactModal } from "../Modals/Contact/ContactModal";
import { LeadProps } from "@/types";

export type TimeRange = "weekly" | "monthly" | "allTime";

export function LeadsQualifiedContent({
  initialLeads,
  timeRange,
}: {
  initialLeads: LeadProps[];
  timeRange: TimeRange;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const leadsInView = useMemo(() => {
    const base =
      filter === null
        ? initialLeads
        : initialLeads.filter((l) => l.properties.looking_for === filter);

    return base.sort((a, b) => {
      const dateA = Date.parse(a.properties.createdate);
      const dateB = Date.parse(b.properties.createdate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [initialLeads, filter, sortOrder]);

  const changeTimeRange = (newRange: TimeRange) => {
    const qs = new URLSearchParams(searchParams);
    qs.set("timeRange", newRange);
    router.replace(`/active-qualifications?${qs.toString()}`);
  };

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  return (
    <div className="space-y-4 w-full">
      {/* filters */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter ? "outline" : "default"}
            onClick={() => setFilter(null)}
          >
            All
          </Button>
          <Button
            variant={filter === "complete_system" ? "default" : "outline"}
            onClick={() => setFilter("complete_system")}
            className="flex items-center gap-2"
          >
            <LayersIcon className="h-4 w-4" /> Complete System
          </Button>
          <Button
            variant={filter === "single_products_quote" ? "default" : "outline"}
            onClick={() => setFilter("single_products_quote")}
            className="flex items-center gap-2"
          >
            <BoxIcon className="h-4 w-4" /> Single Product
          </Button>
        </div>

        <div className="flex gap-2">
          {/* time-range buttons */}
          {(["weekly", "monthly", "allTime"] as const).map((rng) => (
            <Button
              key={rng}
              variant={timeRange === rng ? "default" : "outline"}
              onClick={() => changeTimeRange(rng)}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />{" "}
              {rng[0].toUpperCase() + rng.slice(1)}
            </Button>
          ))}

          {/* sort */}
          <Button
            variant="outline"
            onClick={toggleSortOrder}
            className="flex items-center gap-2 ml-8"
          >
            {sortOrder === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            {sortOrder === "asc" ? "Oldest First" : "Newest First"}
          </Button>
        </div>
      </div>

      {/* list */}
      <div className="flex flex-col w-full gap-2">
        {leadsInView.length ? (
          leadsInView.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => {
                setSelectedLeadId(lead.id);
                setIsModalOpen(true);
              }}
            />
          ))
        ) : (
          <div className="text-center py-4 text-slate-500">
            No leads found for the selected filter.
          </div>
        )}
      </div>

      {/* modal */}
      <ContactModal
        contactId={selectedLeadId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
