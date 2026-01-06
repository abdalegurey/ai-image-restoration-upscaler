import Replicate from "replicate";
import { NextResponse } from "next/server";

import { randomUUID } from "crypto";
import { storeRestore } from "@/lib/database/restore";

// app/api/upscaler/route.ts
export const runtime = "nodejs";


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});



export async function POST(req: Request) {
  try {
    const {userId,  originalImage, imageBase64} = await req.json();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!imageBase64) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

const output = await replicate.run(
  "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
  {
    input: {
        image: imageBase64,
      upscale: 2,
      face_upsample: true,
      background_enhance: true,
      codeformer_fidelity: 0.5
    }
  }
);



    



const resultUrl = (output as any).url();



  const id = randomUUID(); 
await storeRestore({
  id,
  userId,
  originalImage,
  restoredImage:resultUrl,



});
    return NextResponse.json({ success: true, image: resultUrl });
  } catch (error) {
    console.error("Replicate error:", error);
    return NextResponse.json(
      { success: false, message: "Image processing failed" },
      { status: 500 }
    );
  }
}
