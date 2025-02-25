import { NextResponse } from "next/server";

const BUG_URL = process.env.BUG_URL || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(BUG_URL, {
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

    return NextResponse.json({ message: "Report sent successfully" });
  } catch (error) {
    console.error("Report bug API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
