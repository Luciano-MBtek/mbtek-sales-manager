import { NextResponse } from "next/server";
import { createCompleteSystemQuote } from "@/actions/contact/createCompleteSystemQuote";
import { Product } from "@/types";

export async function POST(request: Request) {
  const { dealId, contactId, products } = (await request.json()) as {
    dealId: string;
    contactId: string;
    products: Product[];
  };

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      function send(event: string, payload: any) {
        const data = JSON.stringify(payload);
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
      }

      try {
        if (!dealId || !contactId || !products || products.length === 0) {
          send("error", { error: "Missing data" });
          return;
        }

        const result = await createCompleteSystemQuote({
          dealId,
          contactId,
          products,
          onProgress: (step, percentage) => send("progress", { step, percentage }),
        });

        send("complete", {
          success: true,
          redirect1: result.quoteUrl,
          redirect2: `/contacts/${contactId}`,
          contactId,
        });
      } catch (error) {
        send("error", { error: error instanceof Error ? error.message : "Unknown error" });
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
