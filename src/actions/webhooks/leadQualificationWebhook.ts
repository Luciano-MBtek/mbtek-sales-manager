"use server";
import { lookingForTypeValues } from "@/types";

export async function triggerLeadQualificationWebhook(
  contactId: string,
  systemType: (typeof lookingForTypeValues)[number]
) {
  const URL = process.env.LEAD_QUALIFICATION;

  if (!URL) {
    console.error("Lead qualification webhook URL is not defined");
    return false;
  }

  const webhookResponse = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contactId,
      systemType,
    }),
  });
  if (!webhookResponse.ok) {
    console.error("Error triggering webhook:", await webhookResponse.text());
    return false;
  }
  return true;
}
