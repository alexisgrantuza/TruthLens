// frontend/src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
});

// Export commonly used methods
export const { signIn, signUp, signOut, useSession } = authClient;
