import { NextResponse } from "next/server";
import { getUser } from "@/server/user";
import { selectAllUpscalerByUser } from "@/lib/database/upscaler";

export async function GET() {
  try {
    const session = await getUser();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allupscaler = await selectAllUpscalerByUser(userId);

    return NextResponse.json({ allupscaler });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch upscaler" }, { status: 500 });
  }
}
