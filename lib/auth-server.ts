import { cookies } from "next/headers";

export async function getServerSession() {
  const cookieStore = cookies(); // read-only cookie store

  // Haddii cookie-kaaga la yiraahdo 'better-auth-token':
  const tokenCookie = cookieStore.get("better-auth-token");

  if (!tokenCookie) return null;

  const token = tokenCookie.value;

  try {
    const user = JSON.parse(token); // tusaale fudud, haddii cookie JSON string yahay
    return { user };
  } catch (err) {
    console.error("Session parse failed:", err);
    return null;
  }
}
