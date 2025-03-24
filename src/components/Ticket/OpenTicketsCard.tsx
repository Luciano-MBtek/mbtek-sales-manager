"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PriorityLevel,
  TicketStatus,
  pipelines,
  categories,
  sourceType,
} from "@/components/Ticket/ticketTypes";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/app/my-contacts/utils";
import type { Ticket } from "@/types/ticketTypes";
import {
  Calendar,
  Tag,
  MessageSquare,
  User,
  FileText,
  AlertTriangle,
  Clock,
  Edit,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Button } from "../ui/button";
import { EditTicketModal } from "./edit-ticket-modal";
import DeleteTicket from "./deleteTicket";

interface OpenTicketsCardProps {
  tickets: Ticket[];
}

const OpenTicketsCard = ({ tickets }: OpenTicketsCardProps) => {
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getPriorityColor = (priority: string | undefined) => {
    const priorityItem = PriorityLevel.find(
      (p) => p.value === priority?.toUpperCase()
    );

    if (priorityItem) {
      return priorityItem.color;
    }

    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };
  const getPriorityLabel = (priorityValue: string | undefined) => {
    const priority = PriorityLevel.find(
      (p) => p.value === priorityValue?.toUpperCase()
    );
    return priority?.label || priorityValue || "N/A";
  };

  const getCategoryLabel = (categoryValue: string | undefined) => {
    if (!categoryValue) return "N/A";
    if (categoryValue.includes(";")) {
      const categoryValues = categoryValue.split(";");
      return categoryValues
        .map((value) => {
          const category = categories.find((c) => c.value === value.trim());
          return category?.label || value.trim();
        })
        .join(", ");
    }
    const category = categories.find((c) => c.value === categoryValue);
    return category?.label || categoryValue || "N/A";
  };

  const getSourceLabel = (sourceValue: string | undefined) => {
    const source = sourceType.find((s) => s.value === sourceValue);
    return source?.label || sourceValue || "N/A";
  };

  const getPipelineLabel = (pipelineValue: string | undefined) => {
    const pipeline = pipelines.find((p) => p.value === pipelineValue);
    return pipeline?.label || pipelineValue || "N/A";
  };

  const getStatusLabel = (
    statusValue: string | undefined,
    pipelineValue: string | undefined
  ) => {
    let pipelineType = "";

    if (pipelineValue) {
      const pipeline = pipelines.find((p) => p.value === pipelineValue);
      pipelineType = pipeline?.pipeline || "";
    }

    const status = TicketStatus.find(
      (s) =>
        s.value === statusValue &&
        (!pipelineType || s.pipeline === pipelineType)
    );

    return status?.label || statusValue || "N/A";
  };

  const getPriorityIcon = (priority: string | undefined) => {
    switch (priority?.toUpperCase()) {
      case "URGENT":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case "HIGH":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case "MEDIUM":
        return <Clock className="h-3 w-3 mr-1" />;
      case "LOW":
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string | undefined) => {
    switch (category) {
      case "PRODUCT_ISSUE":
        return <Tag className="h-4 w-4 mr-2 text-muted-foreground" />;
      default:
        return <Tag className="h-4 w-4 mr-2 text-muted-foreground" />;
    }
  };

  const getSourceIcon = (source: string | undefined) => {
    switch (source) {
      case "CHAT":
        return <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />;
      case "EMAIL":
        return <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />;
      default:
        return <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />;
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditModalOpen(true);
  };
  const handleTicketUpdated = () => {
    // Aquí puedes implementar una lógica para refrescar los tickets si es necesario
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md border-muted">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Open Tickets
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No open tickets found.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {tickets.map((ticket) => (
              <AccordionItem
                key={ticket.id}
                value={ticket.id}
                className="border border-muted rounded-md mb-3 overflow-hidden "
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted transition-colors hover:no-underline">
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold">
                        {ticket.properties?.subject || "No Subject"}
                      </h3>
                      <Badge variant="secondary" className="ml-3 text-xs">
                        {formatDate(ticket.properties?.createdate || "")}
                      </Badge>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            className={`${getPriorityColor(ticket.properties?.hs_ticket_priority)} flex items-center no-underline`}
                          >
                            {getPriorityIcon(
                              ticket.properties?.hs_ticket_priority
                            )}
                            {ticket.properties?.hs_ticket_priority || "N/A"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Priority level</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 bg-muted/10">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Created:</span>
                        <span className="text-sm">
                          {formatDate(ticket.properties?.createdate || "")}
                        </span>
                      </div>

                      <div className="flex items-center">
                        {getCategoryIcon(ticket.properties?.hs_ticket_category)}
                        <span className="font-medium mr-2">Category:</span>
                        <span className="text-sm">
                          {getCategoryLabel(
                            ticket.properties?.hs_ticket_category
                          )}
                        </span>
                      </div>

                      <div className="flex items-center">
                        {getSourceIcon(ticket.properties?.source_type)}
                        <span className="font-medium mr-2">Source:</span>
                        <span className="text-sm">
                          {getSourceLabel(ticket.properties?.source_type)}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Owner:</span>
                        <span className="text-sm">
                          {ticket.owner
                            ? `${ticket.owner.firstName} ${ticket.owner.lastName}`
                            : "No Owner"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Pipeline:</span>
                        <span className="text-sm">
                          {getPipelineLabel(ticket.properties?.hs_pipeline)}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Status:</span>
                        <span className="text-sm">
                          {getStatusLabel(
                            ticket.properties?.hs_pipeline_stage,
                            ticket.properties?.hs_pipeline
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="font-medium block mb-2">Content:</span>
                      <p className="whitespace-pre-wrap rounded-lg bg-background p-4 text-sm border border-border shadow-sm">
                        {ticket.properties?.content || "No content"}
                      </p>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTicket(ticket);
                        }}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Ticket
                      </Button>
                      <DeleteTicket
                        ticketId={ticket.id}
                        ticketName={ticket.properties?.subject}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
      {editingTicket && (
        <EditTicketModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          ticket={editingTicket}
          onSubmit={handleTicketUpdated}
        />
      )}
    </Card>
  );
};

export default OpenTicketsCard;
