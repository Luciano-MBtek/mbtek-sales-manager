import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { newQuickQuoteType } from "@/schemas/quickQuoteSchema";
import { createQuickQuote } from "@/actions/contact/createQuickQuote";
import { sleep } from "openai/core.mjs";

export async function POST(request: Request) {
  const body = (await request.json()) as newQuickQuoteType;
  const encoder = new TextEncoder();

  console.log("Body:", body);

  const readable = new ReadableStream({
    async start(controller) {
      function sendProgress(eventName: string, payload: any) {
        const data = JSON.stringify(payload);
        const chunk = `event: ${eventName}\ndata: ${data}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      }

      try {
        sendProgress("progress", { step: "Creating quote...", percentage: 12 });

        const createQuote = await createQuickQuote({
          quickQuote: body,
          onProgress: (step, percentage) => {
            sendProgress("progress", { step, percentage });
          },
        });
        sleep(2000);
        sendProgress("progress", { step: "Creating quote...", percentage: 40 });
        /*   const createQuote = {
          quoteUrl: `/contects/${body.contactId}`,
        }; */
        sendProgress("progress", {
          step: "Quote created",
          quoteUrl: createQuote.quoteUrl,
        });

        revalidatePath(`/contacts/${body.contactId}`);
        revalidatePath(`/contacts/${body.contactId}/properties`);
        revalidatePath(`/contacts/${body.contactId}/deals`);
        revalidatePath(`/contacts/${body.contactId}/quotes`);
        revalidateTag("quotes");
        revalidateTag("contact-deals");
        sendProgress("progress", { step: "Quote Created...", percentage: 100 });

        sendProgress("complete", {
          success: true,
          redirect1: createQuote.quoteUrl,
          redirect2: `/contacts/${body.contactId}`,
          contactId: body.contactId,
        });
      } catch (error) {
        sendProgress("error", {
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
