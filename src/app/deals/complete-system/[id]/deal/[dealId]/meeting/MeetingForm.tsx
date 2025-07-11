"use client";

import { useEffect, useState } from "react";
import { useMeetingLink } from "@/hooks/useMeetingLink";
import MeetingModal from "@/components/Modals/LeadQualification/MeetingModal";
import { Skeleton } from "@/components/ui/skeleton";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { dealStage } from "@/app/mydeals/utils";

import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MeetingFormProps {
  dealId: string;
  ownerId?: string;
  contactEmail: string;
  contactFirstName: string;
  contactLastName: string;
}

export default function MeetingForm({
  dealId,
  ownerId,
  contactEmail,
  contactFirstName,
  contactLastName,
}: MeetingFormProps) {
  const { meetingLinks, isLoading, refetchAll } = useMeetingLink(ownerId);
  const [error, setError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  const meetingLink = meetingLinks.find((link) =>
    link.name.includes("2nd meet: Project proposal presentation")
  );

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    if (!isLoading && !meetingLink && ownerId) {
      if (retryCount < 2) {
        retryTimeout = setTimeout(() => {
          if (refetchAll) refetchAll();
          setRetryCount((prev) => prev + 1);
        }, 500);
      } else {
        setError(true);
      }
    }

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [isLoading, meetingLink, ownerId, refetchAll, retryCount]);

  const handleComplete = async () => {
    try {
      await patchDealProperties(dealId, {
        last_step: "meeting",
        dealstage: dealStage["2nd meet: Quote Presentation & Close"],
      });
    } catch (error) {
      console.error("Error updating deal after meeting:", error);
      setError(true);
    }
  };

  const handleRetry = () => {
    setError(false);
    setRetryCount(0);
    if (refetchAll) refetchAll();
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[500px]">
        <div className="w-full h-[700px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  if (error || (!meetingLink && retryCount >= 3)) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center space-y-4 border rounded-lg p-8">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h3 className="text-xl font-semibold">
          The meeting page could not be loaded
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          An error occurred while loading the meeting schedule. This may be due
          to connection issues or the meeting link not being available in
          Hubspot.
        </p>
        <Badge className="p-4" variant="warning">
          Contact Sales Manager
        </Badge>
      </div>
    );
  }

  return (
    <MeetingModal
      onComplete={handleComplete}
      meetingLink={meetingLink ?? ({} as any)}
      contactEmail={contactEmail}
      contactFirstName={contactFirstName}
      contactLastName={contactLastName}
    />
  );
}
