import Replicate from "replicate";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { storeUpscaler } from "@/lib/database/upscaler";

export const runtime = "nodejs";


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

function safeImageUrl(url: string) {

  if (url.includes("cloudinary.com")) {
    return url.replace(
      "/upload/",
      "/upload/w_1024,h_1024,c_limit/"
    );
  }
  return url;
}


export async function POST(req: Request) {
  try {
    const {
      imageUrl,
      scale = 2,
      faceEnhance = false,
      userId,
      originalImage,
    } = await req.json();

  
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

   
    const safeUrl = safeImageUrl(imageUrl);
    const safeScale = scale > 2 ? 2 : scale; 

  
    const output = await replicate.run(
      "nightmareai/real-esrgan",
      {
        input: {
          image: safeUrl,
          scale: safeScale,
          face_enhance: faceEnhance,
        },
      }
    );

    /* ---------- OUTPUT HANDLING ---------- */
    // let resultImage: string;

    // if (Array.isArray(output)) {
    //   resultImage = output[0];
    // } else if ((output as any)?.url) {
    //   resultImage = (output as any).url();
    // } else {
    //   resultI
    // mage = output as string;
    // }

    const resultImage = (output as any).url();
 
    const id = randomUUID();

    await storeUpscaler({
      id,
      userId,
      originalImage,
      upscalerImage: resultImage,
    });

    /* ---------- RESPONSE ---------- */
    return NextResponse.json({
      success: true,
      url: resultImage,
    });

  } catch (error: any) {
    console.error("Upscaler error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Image processing failed",
      },
      { status: 500 }
    );
  }
}
