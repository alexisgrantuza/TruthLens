// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.config";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
      };
      session?: any;
    }
  }
}

/**
 * Middleware to protect routes - requires authentication
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Please sign in to access this resource",
      });
    }

    // Attach user to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || undefined,
    };
    req.session = session;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (!res.headersSent) {
      res.status(401).json({
        error: "Invalid session",
        message:
          error instanceof Error ? error.message : "Authentication failed",
      });
    }
  }
}

/**
 * Optional auth - doesn't block if not authenticated
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || undefined,
      };
      req.session = session;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}
