"use server";
import OpenAI from "openai";
const apiKey = process.env.OPENAI_API_KEY_MBTEK;
const assistantID = process.env.OPENAI_ASSISTANT_ID;

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function createAIDescription(description: string) {
  try {
    const thread = await openai.beta.threads.createAndRun({
      assistant_id: assistantID!,
      thread: {
        messages: [
          {
            role: "user",
            content: `Your job is to create a better description of the product to generate a paragraph for a quote on this product based on this information: ${description}.
                Write an impactful tagline in 10 words or less that highlights the product's specific features. Avoid using exclamation marks. -Do not exceed 120 words. -Do not offer to visit the url if there is one. -Do not add title to the paragraph.The json structure should be: data : { description: "description" , slogan: "slogan"}`,
          },
        ],
      },
    });

    let runStatus = await openai.beta.threads.runs.retrieve(
      thread.thread_id,
      thread.id
    );

    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        thread.thread_id,
        thread.id
      );
    }

    const messages = await openai.beta.threads.messages.list(thread.thread_id);
    const content = messages.data[0].content[0];

    if ("text" in content) {
      return JSON.parse(content.text.value);
    }
    throw new Error("Expected text response from assistant");
  } catch (error) {
    console.error("Error in create AI description for quote:", error);
    throw error;
  }
}
