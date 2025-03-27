"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "./ui/badge";
import { Engagement } from "@/types/engagementsTypes";

type EngagementsByType = {
  [key: string]: Engagement[];
};

export default function EngagementTabs({
  engagements,
}: {
  engagements: { results: Engagement[] };
}) {
  const [engagementsByType, setEngagementsByType] = useState<EngagementsByType>(
    {}
  );

  useEffect(() => {
    const grouped = engagements.results.reduce(
      (acc: EngagementsByType, engagement) => {
        const type = engagement.engagement.type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(engagement);
        acc[type].sort(
          (a, b) => b.engagement.timestamp - a.engagement.timestamp
        );

        return acc;
      },
      {}
    );

    setEngagementsByType(grouped);
  }, [engagements]);

  const engagementTypes = ["EMAIL", "TASK", "MEETING", "CALL", "NOTE"];

  return (
    <Tabs defaultValue={engagementTypes[0]} className="w-full">
      <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
        {engagementTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {type}
          </TabsTrigger>
        ))}
      </TabsList>
      {engagementTypes.map((type) => (
        <TabsContent key={type} value={type}>
          <Card>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
              <CardDescription>
                Recent {type.toLowerCase()} engagements from HubSpot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="flex flex-col">
                  {engagementsByType[type]?.map((engagement) => (
                    <EngagementItem
                      key={engagement.engagement.id}
                      engagement={engagement}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
function isHTML(str: string): boolean {
  const doc = new DOMParser().parseFromString(str, "text/html");

  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
}
const getPriorityVariant = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "high":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "";
  }
};

function EngagementItem({ engagement }: { engagement: Engagement }) {
  const { type, timestamp, bodyPreview } = engagement.engagement;
  const {
    from,
    to,
    subject,
    toNumber,
    fromNumber,
    durationMilliseconds,
    status,
    title,
    body,
    html,
    priority,
    taskType,
  } = engagement.metadata;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {type === "EMAIL" || (type === "INCOMING_EMAIL" && subject)
            ? subject
            : `${type}  ${title ?? ""}`}
        </CardTitle>
        <CardDescription>
          {new Date(timestamp).toLocaleString()}
          <br></br>
          {status ? "Status:" + " " + status : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {type === "EMAIL" && (
          <>
            <div className="flex flex-col">
              <div>
                <strong>From:</strong> {from?.email}
              </div>
              <div>
                <strong>Agent:</strong> {from?.firstName} {from?.lastName}
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <strong>To:</strong> {to?.map((t) => t.email).join(", ")}
              </div>
              <div>
                <strong>Contact:</strong>{" "}
                {to?.map((t) => `${t.firstName} ${t.lastName}`).join(" ")}
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </>
        )}
        {type === "CALL" && (
          <>
            <p>
              <strong>From:</strong> {fromNumber}
            </p>
            <p>
              <strong>To:</strong> {toNumber}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {Math.round(durationMilliseconds! / 1000)} seconds
            </p>
            <p className="mt-2">{bodyPreview}</p>
          </>
        )}
        {type === "NOTE" && (
          <>
            {isHTML(body) ? (
              <div dangerouslySetInnerHTML={{ __html: body }} />
            ) : (
              <div className="w-[600px]">
                {body.split(/(\d+\s*-\s*)/).map((part, index) =>
                  part.match(/^\d+\s*-\s*$/) ? (
                    <p key={index}>
                      {part}
                      <br key={index} />
                    </p>
                  ) : (
                    part
                  )
                )}
              </div>
            )}
          </>
        )}
        {type === "TASK" && (
          <>
            <p>
              <strong>Subject:</strong> {subject}
            </p>
            <div>
              <strong>Priority:</strong>{" "}
              <Badge className={getPriorityVariant(priority)}>{priority}</Badge>
            </div>

            <p>
              <strong>Task Type:</strong> {taskType}
            </p>
            <p className="mt-2">{bodyPreview}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
