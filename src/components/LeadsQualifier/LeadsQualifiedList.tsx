import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadsQualifiedContent } from "./LeadQualificationContent";
import { getQualifiedLeads } from "@/actions/hubspot/qualifiedLeads";
import { LeadProps } from "@/types";
import { getContactMeetings } from "@/actions/hubspot/meetings/getContactMeetings";

type SearchParams = { timeRange?: "weekly" | "monthly" | "allTime" };

export async function LeadsQualifiedList({
  searchParams,
  hubspotId,
}: {
  searchParams: SearchParams;
  hubspotId?: string;
}) {
  const timeRange = (searchParams.timeRange ?? "monthly") as
    | "weekly"
    | "monthly"
    | "allTime";
  const leads = await getQualifiedLeads(timeRange, hubspotId);

  const leadsIds = leads.map((lead: LeadProps) => lead.id);

  const meetingsAssociations = await getContactMeetings(leadsIds);

  const enrichedLeads = leads.map((lead: LeadProps) => {
    const meetingData = meetingsAssociations[lead.id as any];
    if (meetingData) {
      return {
        ...lead,
        properties: {
          ...lead.properties,
          meetings: meetingData,
        },
      };
    }
    return lead;
  });

  return (
    <Suspense fallback={<LeadsQualifiedSkeleton />}>
      <LeadsQualifiedContent
        initialLeads={enrichedLeads}
        timeRange={timeRange}
      />
    </Suspense>
  );
}

export function LeadsQualifiedSkeleton() {
  return (
    <div className="flex flex-col w-full gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border-slate-200">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 bg-slate-200" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-40 bg-slate-200" />
            <Skeleton className="h-4 w-28 bg-slate-200" />
            <Skeleton className="h-4 w-36 bg-slate-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
