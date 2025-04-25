import { NextResponse } from "next/server";

import { revalidatePath, revalidateTag } from "next/cache";
import setQuote from "@/actions/quote/setQuote";

export async function POST(request: Request) {
  const body = await request.json(); // as newSingleProductType;

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      function sendProgress(eventName: string, payload: any) {
        const data = JSON.stringify(payload);
        const chunk = `event: ${eventName}\ndata: ${data}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      }

      try {
        sendProgress("progress", {
          step: "Setting quote on draft...",
          percentage: 5,
        });
        // set quote to 'draft'
        // const setDraft = setQuote(QuotesId, 'DRAFT')

        sendProgress("progress", {
          step: "deleting old products in deal...",
          percentage: 15,
        });
        // delete all line items associated with deal

        sendProgress("progress", {
          step: "creating new products...",
          percentage: 35,
        });

        // create new line items and associate them with deal

        sendProgress("progress", {
          step: "update new products on quote...",
          percentage: 65,
        });

        // update line items on quote
        sendProgress("progress", {
          step: "updating draft order...",
          percentage: 85,
        });
        // update draft order in shopify

        sendProgress("progress", {
          step: "publishing quote...",
          percentage: 95,
        });
        // publish quote again

        /*  const updatedQuote = await updateSingleProductQuote({
          singleProduct: body,
          onProgress: (step, percentage) => {
            sendProgress("progress", { step, percentage });
          },
        }); */
        sendProgress("progress", {
          step: "Quote updated",
          // quoteUrl: updatedQuote.quoteUrl,
        });

        revalidatePath(`/contacts/${body.id}`);
        revalidatePath(`/contacts/${body.id}/properties`);
        revalidatePath(`/contacts/${body.id}/deals`);
        revalidatePath(`/contacts/${body.id}/quotes`);
        revalidateTag("quotes");
        revalidateTag("contact-deals");

        sendProgress("complete", {
          success: true,
          // redirect1: updatedQuote.quoteUrl,
          redirect2: `/contacts/${body.id}`,
          contactId: body.id,
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
