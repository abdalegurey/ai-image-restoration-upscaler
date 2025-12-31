import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "https://ai-image-restoration-upscaler-8b65.vercel.app"
})


export const {useSession,signIn,signOut,signUp} = authClient;