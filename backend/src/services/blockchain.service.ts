// backend/src/services/blockchain.service.ts
import { ethers } from "ethers";
import {
  getSigner,
  getProvider,
  CONTRACT_ADDRESS,
  TRUTHLENS_ABI,
  isBlockchainConfigured,
} from "../config/blockchain";

/**
 * Create a verification on the blockchain
 */
export async function createBlockchainVerification(data: {
  imageHash: string; // hex string (0x...)
  ipfsCid: string;
  latitude: number;
  longitude: number;
  aiAnalysis: string; // JSON string
}): Promise<{
  verificationId: string;
  txHash: string;
  blockExplorerUrl: string;
}> {
  if (!isBlockchainConfigured()) {
    throw new Error("Blockchain not configured");
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not configured");
  }

  try {
    const signer = getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      TRUTHLENS_ABI,
      signer
    );

    // Convert imageHash from hex string to bytes32
    // Ensure it's a valid 32-byte (64 hex char) hash
    let hashHex = data.imageHash.startsWith("0x")
      ? data.imageHash.slice(2)
      : data.imageHash;
    if (hashHex.length !== 64) {
      throw new Error(
        `Invalid hash length: expected 64 hex characters, got ${hashHex.length}`
      );
    }
    const imageHashBytes32 = `0x${hashHex}`;

    // Convert GPS coordinates to int256 (multiply by 1e6 as per contract)
    const latitudeInt = BigInt(Math.round(data.latitude * 1_000_000));
    const longitudeInt = BigInt(Math.round(data.longitude * 1_000_000));

    // Call the contract
    const tx = await contract.createVerification(
      imageHashBytes32,
      data.ipfsCid,
      latitudeInt,
      longitudeInt,
      data.aiAnalysis
    );

    // Wait for transaction
    const receipt = await tx.wait();

    // Get the verification ID from the event
    const event = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed: any) => parsed && parsed.name === "ImageVerified");

    const verificationId = event
      ? event.args[0] // verificationId is the first indexed parameter
      : ethers.keccak256(
          ethers.AbiCoder.defaultAbiCoder().encode(
            ["bytes32", "address", "uint256", "uint256"],
            [
              imageHashBytes32,
              await signer.getAddress(),
              receipt.blockNumber,
              receipt.blockTimestamp || BigInt(Math.floor(Date.now() / 1000)),
            ]
          )
        );

    return {
      verificationId: verificationId,
      txHash: receipt.hash,
      blockExplorerUrl: `https://polygonscan.com/tx/${receipt.hash}`,
    };
  } catch (error: any) {
    console.error("Blockchain verification error:", error);
    throw new Error(
      `Failed to create blockchain verification: ${error.message}`
    );
  }
}

/**
 * Verify an image hash exists on the blockchain
 */
export async function verifyImageHashOnChain(imageHash: string): Promise<{
  exists: boolean;
  verificationId: string | null;
}> {
  if (!isBlockchainConfigured()) {
    throw new Error("Blockchain not configured");
  }

  try {
    const provider = getProvider();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      TRUTHLENS_ABI,
      provider
    );

    // Convert imageHash to bytes32
    let hashHex = imageHash.startsWith("0x") ? imageHash.slice(2) : imageHash;
    if (hashHex.length !== 64) {
      throw new Error(
        `Invalid hash length: expected 64 hex characters, got ${hashHex.length}`
      );
    }
    const imageHashBytes32 = `0x${hashHex}`;

    const result = await contract.verifyImageHash(imageHashBytes32);

    return {
      exists: result[0],
      verificationId: result[1] !== ethers.ZeroHash ? result[1] : null,
    };
  } catch (error: any) {
    console.error("Blockchain verification check error:", error);
    throw new Error(`Failed to verify image hash: ${error.message}`);
  }
}

/**
 * Get verification details from blockchain
 */
export async function getVerificationFromChain(
  verificationId: string
): Promise<{
  imageHash: string;
  ipfsCid: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  verifier: string;
  aiAnalysis: string;
}> {
  if (!isBlockchainConfigured()) {
    throw new Error("Blockchain not configured");
  }

  try {
    const provider = getProvider();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      TRUTHLENS_ABI,
      provider
    );

    const result = await contract.getVerification(verificationId);

    return {
      imageHash: result[0],
      ipfsCid: result[1],
      latitude: Number(result[2]) / 1_000_000, // Convert back from int256
      longitude: Number(result[3]) / 1_000_000,
      timestamp: Number(result[4]),
      verifier: result[5],
      aiAnalysis: result[6],
    };
  } catch (error: any) {
    console.error("Get verification error:", error);
    throw new Error(`Failed to get verification: ${error.message}`);
  }
}
