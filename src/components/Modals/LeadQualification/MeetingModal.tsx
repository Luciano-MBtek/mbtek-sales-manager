"use client";

import { useEffect, useRef } from "react";

export default function MeetingModal({
  onComplete,
  meetingLink,
  contactEmail,
  contactFirstName,
  contactLastName,
}: {
  onComplete: (data: any) => void;
  meetingLink: { link: string };
  contactEmail: string;
  contactFirstName: string;
  contactLastName: string;
}) {
  const scriptLoaded = useRef(false);

  /* 1️⃣  Load the embed script once */
  useEffect(() => {
    if (scriptLoaded.current) return;
    const script = document.createElement("script");
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    script.async = true;
    script.onload = () => (scriptLoaded.current = true);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  /* 2️⃣  Listen for the booking confirmation */
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // extra safety – be sure it *is* HubSpot talking to us
      if (!event.origin.includes("hubspot.com")) return;

      const data = event.data as any;
      if (data?.meetingBookSucceeded) {
        onComplete(data); // ✅ notify parent
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete]);

  return (
    <div className="w-full h-full min-h-[500px]">
      <div
        className="meetings-iframe-container w-full h-full"
        data-src={`${meetingLink.link}?embed=true&email=${encodeURIComponent(
          contactEmail
        )}&firstName=${encodeURIComponent(
          contactFirstName
        )}&lastName=${encodeURIComponent(contactLastName)}`}
        style={{ height: "700px" }}
      />
    </div>
  );
}
