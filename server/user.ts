"use server"

import { auth } from "../lib/auth"
import { headers } from "next/headers"

export async function getUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session
}

// Signup
export async function signup(email: string, password: string) {
    const user = await auth.api.signUpEmail({
        body: {
            name: email.split("@")[0],
            email,
            password,
        },
    })
    return user
}

// Login
// export async function login(email: string, password: string) {
//   const user= await auth.api.signInEmail({
//         body: {
//             email,
//             password,
//         },
//     })

//     return user
// }





export async function login(email: string, password: string) {
  const response = await auth.api.signInEmail({
   body: {
             email,
             password,
         },
  });

  if (!response.user) {
    throw new Error( "Login failed");
  }

  return response.user;
}
