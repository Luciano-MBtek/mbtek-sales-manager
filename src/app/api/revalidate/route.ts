import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { paths, tags } = await request.json();

    if (paths) {
      paths.forEach((path: string) => revalidatePath(path));
    }

    if (tags) {
      tags.forEach((tag: string) => revalidateTag(tag));
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
