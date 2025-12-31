
// ================= LOGO FUNCTIONS =================
import { db } from "@/db/drizzle";
import { restore } from "@/db/schema";

import { desc, eq } from "drizzle-orm";
interface store{
 id: string;
  userId: string;
    originalImage: string;
    restoredImage: string;
} 
export async function storeRestore(data:store) {
  return db.insert(restore).values(data);
}

// export async function selectAllLogosByUser(userId: string) {
//   return db.select().from(logo).where(logo.userId.eq(userId));
// }

export async function selectAllRestoreByUser(userId: string) {
  if (!userId) return [];

  return await db
    .select()
    .from(restore)
    .where(eq(restore.userId, userId))
    .orderBy(desc(restore.createdAt)); // 👈 KAN UGU MUHIIMSAN
}

