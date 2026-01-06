import Replicate from "replicate";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { storeUpscaler } from "@/lib/database/upscaler";

export const runtime = "nodejs";

/* ---------------- REPLICATE CLIENT ---------------- */
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

/* ---------------- IMAGE SAFETY ---------------- */
function safeImageUrl(url: string) {
  // Haddii Cloudinary la isticmaalayo
  if (url.includes("cloudinary.com")) {
    return url.replace(
      "/upload/",
      "/upload/w_1024,h_1024,c_limit/"
    );
  }
  return url;
}

/* ---------------- API HANDLER ---------------- */
export async function POST(req: Request) {
  try {
    const {
      imageUrl,
      scale = 2,
      faceEnhance = false,
      userId,
      originalImage,
    } = await req.json();

    /* ---------- VALIDATION ---------- */
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

    /* ---------- SAFETY CONTROLS ---------- */
    const safeUrl = safeImageUrl(imageUrl);
    const safeScale = scale > 2 ? 2 : scale; // 4x = GPU crash

    /* ---------- REPLICATE CALL ---------- */
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
    let resultImage: string;

    if (Array.isArray(output)) {
      resultImage = output[0];
    } else if ((output as any)?.url) {
      resultImage = (output as any).url();
    } else {
      resultImage = output as string;
    }

    /* ---------- STORE IN DB ---------- */
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
