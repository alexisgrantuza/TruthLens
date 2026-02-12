// backend/src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.config";
import aiRouter from "./routes/ai.routes";
import ipfsRouter from "./routes/ipfs.routes";
import verificationRouter from "./routes/verification.routes";

const app = express();

// CORS middleware (before auth routes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Body parsing middleware (after auth routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/ai", aiRouter);
app.use("/api/ipfs", ipfsRouter);
app.use("/api/verification", verificationRouter);

// Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
);

export default app;
