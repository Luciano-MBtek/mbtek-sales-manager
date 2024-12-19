"use server";
export async function triggerLeadQualificationWebhook(contactId: string) {
  const webhookResponse = await fetch(
    "https://api-na1.hubapi.com/automation/v4/webhook-triggers/24467819/iFDAdFK",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactId,
      }),
    }
  );
  if (!webhookResponse.ok) {
    console.error("Error triggering webhook:", await webhookResponse.text());
    return false;
  }
  return true;
}
