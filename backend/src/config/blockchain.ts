// backend/src/config/blockchain.ts
import { ethers } from "ethers";

export const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "";
export const CONTRACT_ADDRESS = process.env.TRUTHLENS_CONTRACT_ADDRESS || "";
export const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// TruthLens Contract ABI (minimal interface for createVerification)
export const TRUTHLENS_ABI = [
  "function createVerification(bytes32 _imageHash, string memory _ipfsCid, int256 _latitude, int256 _longitude, string memory _aiAnalysis) external returns (bytes32)",
  "function getVerification(bytes32 _verificationId) external view returns (bytes32 imageHash, string memory ipfsCid, int256 latitude, int256 longitude, uint256 timestamp, address verifier, string memory aiAnalysis)",
  "function verifyImageHash(bytes32 _imageHash) external view returns (bool exists, bytes32 verificationId)",
  "event ImageVerified(bytes32 indexed verificationId, bytes32 indexed imageHash, address indexed verifier, uint256 timestamp, string ipfsCid)",
] as const;

/**
 * Get a provider for Polygon Mumbai
 */
export function getProvider(): ethers.Provider {
  if (!MUMBAI_RPC_URL) {
    throw new Error("MUMBAI_RPC_URL not configured");
  }
  return new ethers.JsonRpcProvider(MUMBAI_RPC_URL);
}

/**
 * Get a signer for Polygon Mumbai (for contract writes)
 */
export function getSigner(): ethers.Wallet {
  if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not configured");
  }
  const provider = getProvider();
  return new ethers.Wallet(PRIVATE_KEY, provider);
}

/**
 * Check if blockchain is configured
 */
export function isBlockchainConfigured(): boolean {
  return !!(MUMBAI_RPC_URL && CONTRACT_ADDRESS && PRIVATE_KEY);
}
