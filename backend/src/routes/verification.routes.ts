// backend/src/routes/verification.routes.ts
import { Router } from "express";
import {
  createVerification,
  verifyImageHash,
  getUserVerifications,
  getVerification,
} from "../controllers/verification.controller";

const router = Router();

// Create a new verification
router.post("/create", createVerification);

// Verify an image hash
router.post("/verify", verifyImageHash);

// Get all verifications for a user
router.get("/user/:userId", getUserVerifications);

// Get a specific verification by ID
router.get("/:id", getVerification);

export default router;
