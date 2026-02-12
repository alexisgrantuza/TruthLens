// backend/src/controllers/verification.controller.ts
import { Request, Response } from "express";
import { hashImage } from "../services/hashing.service";
import { uploadToIPFS } from "../services/pinata.service";
import { analyzeImageForDeepfake } from "../services/ai.service";
import {
  createBlockchainVerification,
  verifyImageHashOnChain,
} from "../services/blockchain.service";
import prisma from "../utils/prisma";

/**
 * Create a new verification record
 * POST /api/verification/create
 */
export async function createVerification(req: Request, res: Response) {
  try {
    const { userId, imageHash, imageBase64, location, isPrivate } = req.body;

    // Validate required fields
    if (!userId || !imageBase64) {
      return res.status(400).json({
        error: "Missing required fields: userId and imageBase64",
      });
    }

    // Step 1: Hash the image (verify hash if provided, or generate new one)
    let finalImageHash: string;
    if (imageHash) {
      // Verify the hash matches
      const computedHash = hashImage(imageBase64);
      if (computedHash.toLowerCase() !== imageHash.toLowerCase()) {
        return res.status(400).json({
          error: "Image hash mismatch. Hash does not match image data.",
        });
      }
      finalImageHash = computedHash;
    } else {
      finalImageHash = hashImage(imageBase64);
    }

    // Step 2: Upload to IPFS
    let ipfsCid: string | null = null;
    let ipfsUrl: string | null = null;
    try {
      const ipfsResult = await uploadToIPFS(imageBase64);
      ipfsCid = ipfsResult.cid;
      ipfsUrl = ipfsResult.url;
    } catch (ipfsError: any) {
      console.error("IPFS upload failed:", ipfsError);
      // Continue without IPFS if it fails (optional step)
    }

    // Step 3: AI Analysis
    let aiAnalysis: any = null;
    try {
      const analysis = await analyzeImageForDeepfake(imageBase64);
      aiAnalysis = {
        description: analysis.description,
        probability: analysis.probability,
        isAuthentic: analysis.isAuthentic,
        analyzedAt: new Date().toISOString(),
      };
    } catch (aiError: any) {
      console.error("AI analysis failed:", aiError);
      // Continue without AI analysis if it fails
      aiAnalysis = {
        description: "AI analysis unavailable",
        probability: 0.1,
        isAuthentic: true,
        analyzedAt: new Date().toISOString(),
      };
    }

    // Step 4: Create blockchain verification
    let blockchainTxHash: string | null = null;
    let verificationId: string | null = null;
    let blockExplorerUrl: string | null = null;

    try {
      const blockchainResult = await createBlockchainVerification({
        imageHash: finalImageHash,
        ipfsCid: ipfsCid || "",
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        aiAnalysis: JSON.stringify(aiAnalysis),
      });

      blockchainTxHash = blockchainResult.txHash;
      verificationId = blockchainResult.verificationId;
      blockExplorerUrl = blockchainResult.blockExplorerUrl;
    } catch (blockchainError: any) {
      console.error("Blockchain verification failed:", blockchainError);
      // Return error - blockchain is critical
      return res.status(500).json({
        error: "Failed to create blockchain verification",
        message: blockchainError.message,
      });
    }

    // Step 5: Save to database
    const verification = await prisma.imageVerification.create({
      data: {
        userId,
        imageHash: finalImageHash,
        ipfsCid,
        blockchainTxHash,
        location: location || null,
        aiAnalysis,
        isPrivate: isPrivate || false,
      },
    });

    // Return success response
    res.status(201).json({
      success: true,
      verification: {
        id: verification.id,
        imageHash: verification.imageHash,
        ipfsCid: verification.ipfsCid,
        ipfsUrl,
        blockchainTxHash: verification.blockchainTxHash,
        verificationId,
        blockExplorerUrl,
        timestamp: verification.timestamp,
        location: verification.location,
        aiAnalysis: verification.aiAnalysis,
        isPrivate: verification.isPrivate,
      },
    });
  } catch (error: any) {
    console.error("Create verification error:", error);
    res.status(500).json({
      error: "Failed to create verification",
      message: error.message,
    });
  }
}

/**
 * Verify an image hash exists on blockchain
 * POST /api/verification/verify
 */
export async function verifyImageHash(req: Request, res: Response) {
  try {
    const { imageHash } = req.body;

    if (!imageHash) {
      return res.status(400).json({
        error: "Missing required field: imageHash",
      });
    }

    // Check blockchain
    const blockchainResult = await verifyImageHashOnChain(imageHash);

    // Also check database
    const dbVerification = await prisma.imageVerification.findUnique({
      where: {
        imageHash: imageHash,
      },
    });

    res.json({
      exists: blockchainResult.exists || !!dbVerification,
      onBlockchain: blockchainResult.exists,
      inDatabase: !!dbVerification,
      verificationId: blockchainResult.verificationId,
      verification: dbVerification
        ? {
            id: dbVerification.id,
            ipfsCid: dbVerification.ipfsCid,
            blockchainTxHash: dbVerification.blockchainTxHash,
            timestamp: dbVerification.timestamp,
            aiAnalysis: dbVerification.aiAnalysis,
          }
        : null,
    });
  } catch (error: any) {
    console.error("Verify image hash error:", error);
    res.status(500).json({
      error: "Failed to verify image hash",
      message: error.message,
    });
  }
}

/**
 * Get all verifications for a user
 * GET /api/verification/user/:userId
 */
export async function getUserVerifications(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required parameter: userId",
      });
    }

    const verifications = await prisma.imageVerification.findMany({
      where: {
        userId,
        isPrivate: false, // Only return public verifications
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    res.json({
      success: true,
      verifications: verifications.map((v) => ({
        id: v.id,
        imageHash: v.imageHash,
        ipfsCid: v.ipfsCid,
        blockchainTxHash: v.blockchainTxHash,
        timestamp: v.timestamp,
        location: v.location,
        aiAnalysis: v.aiAnalysis,
      })),
    });
  } catch (error: any) {
    console.error("Get user verifications error:", error);
    res.status(500).json({
      error: "Failed to get verifications",
      message: error.message,
    });
  }
}

/**
 * Get a specific verification by ID
 * GET /api/verification/:id
 */
export async function getVerification(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const verification = await prisma.imageVerification.findUnique({
      where: {
        id,
      },
    });

    if (!verification) {
      return res.status(404).json({
        error: "Verification not found",
      });
    }

    res.json({
      success: true,
      verification: {
        id: verification.id,
        imageHash: verification.imageHash,
        ipfsCid: verification.ipfsCid,
        blockchainTxHash: verification.blockchainTxHash,
        timestamp: verification.timestamp,
        location: verification.location,
        aiAnalysis: verification.aiAnalysis,
        isPrivate: verification.isPrivate,
      },
    });
  } catch (error: any) {
    console.error("Get verification error:", error);
    res.status(500).json({
      error: "Failed to get verification",
      message: error.message,
    });
  }
}
