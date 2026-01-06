
// ================= LOGO FUNCTIONS =================
import { db } from "@/db/drizzle";
import { restore, upscaler } from "@/db/schema";

import { desc, eq } from "drizzle-orm";
interface store{
 id: string;
  userId: string;
    originalImage: string;
     upscalerImage: string;
} 
export async function storeUpscaler(data:store) {
  return db.insert(upscaler).values(data);
}

// export async function selectAllLogosByUser(userId: string) {
//   return db.select().from(logo).where(logo.userId.eq(userId));
// }

// export async function selectAllUpscalerByUser(userId: string) {
//   if (!userId) return [];

//   return await db
//     .select()
//     .from(upscaler)
//     .where(eq(upscaler.userId, userId));
//     .orderBy(desc(upscaler.createdAt)); // 👈 KAN UGU MUHIIMSAN
// }

export const selectAllUpscalerByUser = (userId: string) => {
   if (!userId) return [];
  return db
    .select()
    .from(upscaler)
    .where(eq(upscaler.userId, userId))
    .orderBy(desc(upscaler.createdAt)); // 👈 KAN UGU MUHIIMSAN
};
