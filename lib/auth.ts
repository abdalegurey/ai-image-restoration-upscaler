import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { authSchema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { cookies } from "next/headers";

export const auth = betterAuth({


    emailAndPassword: { 
    enabled: true, 
  }, 
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
  provider: "pg",
  schema: authSchema,
}),
     socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            accessType:"offline",
            prompt:"select_account consent"
        }, 

        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
      
            prompt:"select_account"
        },
    },

     // ✅ APP ROUTER COOKIE HANDLING (MUHIIM)
//   cookies: {
//     get: (key) => cookies().get(key)?.value,
//     set: (key, value, options) =>
//       cookies().set({ name: key, value, ...options }),
//     delete: (key) => cookies().delete(key),
//   },
    plugins: [nextCookies()] // make sure this is the last plugin
});



