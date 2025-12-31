import { NextResponse } from "next/server";
import { db } from "@/db/drizzle"; // your Drizzle instance

import { getUser } from "@/server/user";
import { selectAllRestoreByUser } from "@/lib/database/restore";


export async function GET() {
  try {
    

     const session =await getUser();
     const userId=session?.user?.id

       if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // const allLogos = await selectAllLogosByUser(userId);
    

    const allrestore =  await selectAllRestoreByUser(userId)

    return NextResponse.json({allrestore});
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch logos" }, { status: 500 });
  }
}
