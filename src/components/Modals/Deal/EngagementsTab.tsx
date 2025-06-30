"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Engagement } from "@/types/engagementsTypes";
import { Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEngagementIcon } from "../Contact/utils";
import { getDealEngagements } from "@/actions/deals/getDealEngagements";

interface EngagementsTabProps {
  dealId: string;
}

const EngagementsTab = ({ dealId }: EngagementsTabProps) => {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngagements = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDealEngagements(dealId);
        setEngagements(
          (data?.results || []).sort(
            (a: Engagement, b: Engagement) =>
              b.engagement.timestamp - a.engagement.timestamp
          )
        );
      } catch (err) {
        console.error("Error fetching engagements:", err);
        setError("Failed to load engagements");
      } finally {
        setLoading(false);
      }
    };

    fetchEngagements();
  }, [dealId]);

  return (
    <TabsContent value="engagements" className="mt-4">
      {loading ? (
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
        <ScrollArea className="h-[390px] pr-2">
          <div className="space-y-3">
            {engagements.map((engagement) => (
              <Card key={engagement.engagement.id} className="overflow-hidden">
                <CardHeader className="py-2 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted rounded-full p-1.5">
                        {getEngagementIcon(engagement.engagement.type)}
                      </div>
                      <CardTitle className="text-sm font-medium">
                        {engagement.metadata.title ||
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
                <CardContent className="py-2 px-4 text-xs text-muted-foreground line-clamp-3">
                  {engagement.engagement.bodyPreview}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
          <Mail className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
          <p className="text-muted-foreground">
            No engagements found for this deal
          </p>
        </div>
      )}
    </TabsContent>
  );
};

export default EngagementsTab;
