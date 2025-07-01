"use client";

import { useEffect } from "react";
import { useMeetingLink } from "@/hooks/useMeetingLink";
import MeetingModal from "@/components/Modals/LeadQualification/MeetingModal";
import { Skeleton } from "@/components/ui/skeleton";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";

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

  const meetingLink = meetingLinks.find((link) =>
    link.name.includes("2nd meet: Project proposal presentation")
  );

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    if (!isLoading && !meetingLink && ownerId) {
      retryTimeout = setTimeout(() => {
        if (refetchAll) refetchAll();
      }, 2000);
    }

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [isLoading, meetingLink, ownerId, refetchAll]);

  const handleComplete = async () => {
    try {
      await patchDealProperties(dealId, { last_step: "meeting" });
    } catch (error) {
      console.error("Error updating deal after meeting:", error);
    }
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
