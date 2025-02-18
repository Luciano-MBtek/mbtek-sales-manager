import { NextResponse } from "next/server";

const CHATBOT_URL = process.env.CHATBOT_URL || "";

export async function POST(request: Request) {
  try {
    const { chatInput, sessionId } = await request.json();

    const response = await fetch(CHATBOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatInput,
        sessionId,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
