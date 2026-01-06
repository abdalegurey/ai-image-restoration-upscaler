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


    //  const resultUrl = Array.isArray(output) ? output[0].url : output;

//     let resultUrl: string;

// if (Array.isArray(output)) {
//   resultUrl = output[0]; // CodeFormer badanaa array ayuu soo celiyaa
// } else {
//   resultUrl = output as string;
// }


//console.log(" resultUrl", resultUrl)
//     let resultUrl: string;

// if (Array.isArray(output)) {
//   // Haddii output array ah
//   resultUrl = output[0]?.url || output[0];
// } else {
//   // Haddii output object ah
//   resultUrl = (output as any)?.url || output as string;
// }

    
// let resultUrl: string;
// if (Array.isArray(output)) {
//   resultUrl = output[0].url || output[0]; 
// } else if (output.url()) {
//   resultUrl = output.url();
// } else {
//   resultUrl = output.url() as string;
// }

// let resultUrl: string;

// if (Array.isArray(output)) {
//   const first = output[0] as any;
//   resultUrl = typeof first === "string" ? first : first.url;
// } else {
//   resultUrl = output as string;
// }


const resultUrl = (output as any).url();
//  const resultUrl = output[0];

// let resultUrl: string;

// if (Array.isArray(output)) {
//   const first = output[0] as any;
//   resultUrl = typeof first === "string" ? first : first.url;
// } else if (typeof output === "string") {
//   resultUrl = output;
// } else if ((output as any).url) {
//   resultUrl = (output as any).url;
// } else {
//   throw new Error("Invalid Replicate output format");
// }




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
