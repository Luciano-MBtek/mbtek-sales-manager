import { NextResponse } from "next/server";
import {
  stepOneProductSchema,
  stepTwoSingleProductSchema,
  newSingleProductType,
} from "@/schemas/singleProductSchema";
import { createSingleProductQuote } from "@/actions/contact/createSingleProductQuote";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const body = (await request.json()) as newSingleProductType;

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      function sendProgress(eventName: string, payload: any) {
        const data = JSON.stringify(payload);
        const chunk = `event: ${eventName}\ndata: ${data}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      }

      try {
        sendProgress("progress", { step: "Validating step 1", percentage: 0 });
        const stepOneValidated = stepOneProductSchema.safeParse(body);
        if (!stepOneValidated.success) {
          sendProgress("error", { error: "Please validate step one." });
          return;
        }
        sendProgress("progress", {
          step: "Step 1 validated OK",
          percentage: 5,
        });

        sendProgress("progress", { step: "Validating step 2", percentage: 7 });
        const stepTwoValidated = stepTwoSingleProductSchema.safeParse(body);
        if (!stepTwoValidated.success) {
          sendProgress("error", { error: "Please validate step two." });
          return;
        }
        sendProgress("progress", {
          step: "Step 2 validated OK",
          percentage: 10,
        });

        sendProgress("progress", { step: "Creating quote...", percentage: 12 });
        const createQuote = await createSingleProductQuote({
          singleProduct: body,
          onProgress: (step, percentage) => {
            sendProgress("progress", { step, percentage });
          },
        });
        sendProgress("progress", {
          step: "Quote created",
          quoteUrl: createQuote.quoteUrl,
        });

        revalidatePath(`/contacts/${body.id}`);
        revalidatePath(`/contacts/${body.id}/properties`);
        revalidatePath(`/contacts/${body.id}/deals`);
        revalidatePath(`/contacts/${body.id}/quotes`);

        sendProgress("complete", {
          success: true,
          redirect1: createQuote.quoteUrl,
          redirect2: `/contacts/${body.id}`,
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
