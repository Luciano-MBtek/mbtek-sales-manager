"use client";
import { getQualifiedLeads } from "@/actions/hubspot/qualifiedLeads";
import { useEffect, useState } from "react";
import { LeadsQualifiedSkeleton } from "./LeadsQualifiedList";
import { Button } from "../ui/button";
import {
  ArrowDown,
  ArrowUp,
  BarChart4,
  BoxIcon,
  Calendar,
  FilesIcon,
  LayersIcon,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatDateWithDay } from "@/lib/utils";
import { ContactModal } from "../Modals/Contact/ContactModal";

interface LeadProps {
  id: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string | null;
    phone: string | null;
    bant_score: string | null;
    country: string | null;
    createdate: string;
    looking_for: string; // complete_system or single_products_quote
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export function LeadsQualifiedContent() {
  const [leads, setLeads] = useState<LeadProps[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default sort newest first
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchLeads() {
      try {
        const qualifiedLeads = await getQualifiedLeads();
        setLeads(qualifiedLeads);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Filter leads based on selected filter
  const filteredLeads = filter
    ? leads.filter((lead) => lead.properties.looking_for === filter)
    : leads;

  // Sort leads by createdate
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const dateA = new Date(a.properties.createdate).getTime();
    const dateB = new Date(b.properties.createdate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleOpenModal = (lead: LeadProps) => {
    setSelectedLeadId(lead.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeadId(null);
  };

  if (isLoading) {
    return <LeadsQualifiedSkeleton />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === null ? "default" : "outline"}
            onClick={() => setFilter(null)}
          >
            All
          </Button>
          <Button
            variant={filter === "complete_system" ? "default" : "outline"}
            onClick={() => setFilter("complete_system")}
            className="flex items-center gap-2"
          >
            <LayersIcon className="h-4 w-4" />
            Complete System
          </Button>
          <Button
            variant={filter === "single_products_quote" ? "default" : "outline"}
            onClick={() => setFilter("single_products_quote")}
            className="flex items-center gap-2"
          >
            <BoxIcon className="h-4 w-4" />
            Single Product
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={toggleSortOrder}
          className="flex items-center gap-2"
        >
          {sortOrder === "asc" ? (
            <>
              <ArrowUp className="h-4 w-4" /> Oldest First
            </>
          ) : (
            <>
              <ArrowDown className="h-4 w-4" /> Newest First
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col w-full gap-2">
        {sortedLeads.length > 0 ? (
          sortedLeads.map((lead: LeadProps) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => handleOpenModal(lead)}
            />
          ))
        ) : (
          <div className="text-center py-4 text-slate-500">
            No leads found for the selected filter.
          </div>
        )}
      </div>

      <ContactModal
        contactId={selectedLeadId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

function LeadCard({ lead, onClick }: { lead: LeadProps; onClick: () => void }) {
  // Parse BANT score if available
  const bantScore = lead.properties.bant_score
    ? JSON.parse(lead.properties.bant_score)
    : null;

  const totalScore = bantScore?.total || 0;
  const scoreColor = totalScore >= 75 ? "text-green-600" : "text-amber-600";

  return (
    <Card
      className="border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500" />
            {lead.properties.firstname} {lead.properties.lastname}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            {formatDateWithDay(lead.properties.createdate)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <div>
            {lead.properties.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700 truncate">
                  {lead.properties.email}
                </span>
              </div>
            )}

            {lead.properties.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{lead.properties.phone}</span>
              </div>
            )}

            {bantScore && (
              <div className="flex items-center gap-2 text-sm">
                <BarChart4 className="h-4 w-4 text-slate-500" />
                <span className={`font-medium ${scoreColor}`}>
                  BANT Score: {bantScore.total}%
                </span>
              </div>
            )}
          </div>
          <div>
            {lead.properties.looking_for && (
              <div className="flex items-center gap-2 text-sm">
                {lead.properties.looking_for === "complete_system" ? (
                  <LayersIcon className="h-4 w-4 text-slate-500" />
                ) : lead.properties.looking_for === "single_products_quote" ? (
                  <BoxIcon className="h-4 w-4 text-slate-500" />
                ) : (
                  <FilesIcon className="h-4 w-4 text-slate-500" />
                )}
                <p className="font-bold">
                  {lead.properties.looking_for === "complete_system"
                    ? "Complete System"
                    : lead.properties.looking_for === "single_products_quote"
                      ? "Single Product"
                      : lead.properties.looking_for}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
