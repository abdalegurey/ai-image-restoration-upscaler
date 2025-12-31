import { NextResponse } from "next/server";
import { db } from "@/db/drizzle"; // your Drizzle instance

import { getUser } from "@/server/user";
import { selectAllRestoreByUser } from "@/lib/database/restore";
import { selectAllUpscalerByUser } from "@/lib/database/upscaler";


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
    

    const allupscaler =  await selectAllUpscalerByUser(userId)

    return NextResponse.json({allupscaler});
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch logos" }, { status: 500 });
  }

}


