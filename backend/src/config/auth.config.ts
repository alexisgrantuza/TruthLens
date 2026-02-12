// backend/src/config/auth.config.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../utils/prisma";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Secret key for signing tokens (required)
  secret:
    process.env.BETTER_AUTH_SECRET || "supersecretdevkeychangeinproduction",

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true for production
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // Social OAuth providers - only enable if credentials are provided
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${
        process.env.BACKEND_URL || "http://localhost:3001"
      }/api/auth/callback/google`,
      accessType: "offline",
      prompt: "select_account consent",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      redirectURI: `${
        process.env.BACKEND_URL || "http://localhost:3001"
      }/api/auth/callback/facebook`,
      accessType: "offline",
      prompt: "select_account consent",
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      redirectURI: `${
        process.env.BACKEND_URL || "http://localhost:3001"
      }/api/auth/callback/twitter`,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
      strategy: "jwe", // or "jwt" or "jwe"
    },
  },

  // Security options
  advanced: {
    cookiePrefix: "truthlens",
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  rateLimit: {
    enabled: true,
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },

  // Base URL
  baseURL: process.env.BACKEND_URL || "http://localhost:3001",

  // Trust proxy (important for deployment)
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
});

// Export the handler for Express
export type Auth = typeof auth;
