import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Engagement } from "@/types/engagementsTypes";
import { Loader2, Mail, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEngagementsById } from "@/actions/getEngagementsById";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getEngagementIcon, getPriorityVariant } from "./utils";

interface EngagementsModalTabProps {
  contactId: string;
}

const ENGAGEMENT_TYPES = [
  "ALL",
  "EMAIL",
  "INCOMING_EMAIL",
  "CALL",
  "NOTE",
  "TASK",
  "MEETING",
];

const EngagementsModalTab = ({ contactId }: EngagementsModalTabProps) => {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [filteredEngagements, setFilteredEngagements] = useState<Engagement[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortAscending, setSortAscending] = useState<boolean>(false);

  useEffect(() => {
    const fetchEngagements = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const engagements = await getEngagementsById(contactId);
        setEngagements(
          (engagements.results || []).sort(
            (a: Engagement, b: Engagement) =>
              b.engagement.timestamp - a.engagement.timestamp
          )
        );
      } catch (err) {
        console.error("Error fetching engagements:", err);
        setError("Failed to load engagement information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEngagements();
  }, [contactId]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...engagements];

    // Filter by type
    if (typeFilter !== "ALL") {
      filtered = filtered.filter(
        (engagement) => engagement.engagement.type === typeFilter
      );
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      if (sortAscending) {
        return a.engagement.timestamp - b.engagement.timestamp;
      } else {
        return b.engagement.timestamp - a.engagement.timestamp;
      }
    });

    setFilteredEngagements(filtered);
  }, [engagements, typeFilter, sortAscending]);

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  return (
    <TabsContent value="engagements" className="mt-4">
      {isLoading ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading engagements...
          </span>
        </div>
      ) : error ? (
        <div className="min-h-[200px] flex items-center justify-center text-destructive">
          {error}
        </div>
      ) : engagements.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-3 gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {ENGAGEMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "ALL" ? "All types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={toggleSort}
              className="flex items-center gap-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortAscending ? "Oldest first" : "Newest first"}
            </Button>
          </div>
          <ScrollArea className="h-[340px] pr-2 max-w-[720px]">
            <div className="space-y-3">
              {filteredEngagements.length > 0 ? (
                filteredEngagements.map((engagement) => (
                  <Card
                    key={engagement.engagement.id}
                    className="overflow-hidden"
                  >
                    <CardHeader className="py-2 px-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted rounded-full p-1.5">
                            {getEngagementIcon(engagement.engagement.type)}
                          </div>
                          <CardTitle className="text-sm font-medium">
                            {engagement.engagement.type === "EMAIL"
                              ? engagement.metadata.subject
                              : engagement.metadata.title ||
                                engagement.engagement.type}
                          </CardTitle>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            engagement.engagement.timestamp
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      {/* ... existing code ... */}
                      {engagement.engagement.type === "EMAIL" && (
                        <div className="text-xs text-muted-foreground">
                          <div className="flex gap-1 mb-1">
                            <span>From:</span>
                            <span className="font-medium">
                              {engagement.metadata.from?.email}
                            </span>
                          </div>
                          <div className="line-clamp-2">
                            {engagement.engagement.bodyPreview}
                          </div>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full mt-2"
                          >
                            <AccordionItem
                              value={`email-content-${engagement.engagement.id}`}
                              className="border-none"
                            >
                              <AccordionTrigger className="py-1 px-2 text-[10px] bg-muted/50 rounded-sm hover:no-underline">
                                View full email
                              </AccordionTrigger>
                              <AccordionContent>
                                <div
                                  className="mt-2 text-xs max-h-[200px] overflow-auto"
                                  dangerouslySetInnerHTML={{
                                    __html: engagement.metadata.html,
                                  }}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                      {engagement.engagement.type === "INCOMING_EMAIL" && (
                        <div className="text-xs text-muted-foreground">
                          <div className="flex gap-1 mb-1">
                            <span>From:</span>
                            <span className="font-medium">
                              {engagement.metadata.from?.email}
                            </span>
                          </div>
                          <div className="line-clamp-2">
                            {engagement.engagement.bodyPreview}
                          </div>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full mt-2"
                          >
                            <AccordionItem
                              value={`email-content-${engagement.engagement.id}`}
                              className="border-none"
                            >
                              <AccordionTrigger className="py-1 px-2 text-[10px] bg-muted/50 rounded-sm hover:no-underline">
                                View full email
                              </AccordionTrigger>
                              <AccordionContent>
                                <div
                                  className="mt-2 text-xs max-h-[200px] overflow-auto"
                                  dangerouslySetInnerHTML={{
                                    __html: engagement.metadata.html,
                                  }}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                      {engagement.engagement.type === "CALL" && (
                        <div className="text-xs text-muted-foreground">
                          <div className="flex justify-between mb-1">
                            <span>
                              {engagement.metadata.fromNumber} →{" "}
                              {engagement.metadata.toNumber}
                            </span>
                            <span>
                              {Math.round(
                                (engagement.metadata.durationMilliseconds ||
                                  0) / 1000
                              )}
                              s
                            </span>
                          </div>
                          <div className="line-clamp-2">
                            {engagement.engagement.bodyPreview}
                          </div>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full mt-2"
                          >
                            <AccordionItem
                              value={`email-content-${engagement.engagement.id}`}
                              className="border-none"
                            >
                              <AccordionTrigger className="py-1 px-2 text-[10px] bg-muted/50 rounded-sm hover:no-underline">
                                View full call
                              </AccordionTrigger>
                              <AccordionContent>
                                <div
                                  className="mt-2 text-xs max-h-[200px] overflow-auto"
                                  dangerouslySetInnerHTML={{
                                    __html: engagement.metadata.body,
                                  }}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                      {engagement.engagement.type === "NOTE" && (
                        <div
                          className="mt-2 text-xs max-h-[200px] overflow-auto"
                          dangerouslySetInnerHTML={{
                            __html: engagement.metadata.body,
                          }}
                        />
                      )}
                      {engagement.engagement.type === "TASK" && (
                        <div className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{engagement.metadata.taskType}</span>
                            <Badge
                              className={getPriorityVariant(
                                engagement.metadata.priority
                              )}
                            >
                              {engagement.metadata.priority}
                            </Badge>
                            <span className="ml-auto bg-muted px-1.5 py-0.5 rounded text-[10px]">
                              {engagement.metadata.status}
                            </span>
                          </div>
                          <div className="line-clamp-2">
                            {engagement.engagement.bodyPreview}
                          </div>
                        </div>
                      )}
                      {engagement.engagement.type === "MEETING" && (
                        <div className="text-xs line-clamp-3 text-muted-foreground">
                          {engagement.engagement.bodyPreview}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
                  <Mail className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                  <p className="text-muted-foreground">
                    No engagements found matching the selected filter
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
          <Mail className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
          <p className="text-muted-foreground">
            No engagements found for this contact
          </p>
        </div>
      )}
    </TabsContent>
  );
};

export default EngagementsModalTab;
