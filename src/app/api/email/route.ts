import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const EMAIL_URL = process.env.EMAIL_URL || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(EMAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.message === "Error in workflow") {
      return NextResponse.json(
        { error: "Failed to send email through workflow" },
        { status: 500 }
      );
    }
    revalidateTag("engagements");

    return NextResponse.json({
      message: "Email sent successfully",
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
