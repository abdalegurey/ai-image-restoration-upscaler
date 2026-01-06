import Replicate from "replicate";
import { NextResponse } from "next/server";

import { randomUUID } from "crypto";
import { storeUpscaler } from "@/lib/database/upscaler";
// app/api/upscaler/route.ts
export const runtime = "nodejs";


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { imageUrl, scale = 2, faceEnhance = false,userId,  originalImage } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

     if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }


    const output = await replicate.run("nightmareai/real-esrgan", {
      input: {
        image: imageUrl,
        scale: scale,           // 2x or 4x
        face_enhance: faceEnhance,
      },
    });

   // const resultimage= Array.isArray(output) ? output[0] : output;

    let resultimage: string;
if (Array.isArray(output)) {
 resultimage = output[0].url || output[0]; 
} else if (output.url()) {
 resultimage = output.url();
} else {
 resultimage = output.url() as string;
}
   
     const id = randomUUID(); // 

    await storeUpscaler({
         id,
  userId,
  originalImage,
   upscalerImage:resultimage,
    })
    return NextResponse.json({ url: resultimage });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

