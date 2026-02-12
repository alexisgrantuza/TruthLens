// backend/src/services/ipfs.service.ts
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY;

/**
 * Upload base64 image to IPFS via Pinata
 */
export async function uploadToIPFS(base64Image: string): Promise<{
  cid: string;
  url: string;
}> {
  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    throw new Error("Pinata API credentials not configured");
  }

  try {
    // Remove data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Create form data
    const formData = new FormData();
    formData.append("file", buffer, {
      filename: `truthlens-${Date.now()}.jpg`,
      contentType: "image/jpeg",
    });

    // Optional: Add metadata
    const metadata = JSON.stringify({
      name: `TruthLens Verification ${Date.now()}`,
      keyvalues: {
        app: "truthlens",
        timestamp: new Date().toISOString(),
      },
    });
    formData.append("pinataMetadata", metadata);

    // Upload to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    const cid = response.data.IpfsHash;

    return {
      cid,
      url: `${PINATA_GATEWAY}${cid}`,
    };
  } catch (error: any) {
    console.error("IPFS upload error:", error.response?.data || error.message);
    throw new Error("Failed to upload to IPFS");
  }
}

/**
 * Get IPFS file URL
 */
export function getIPFSUrl(cid: string): string {
  return `${PINATA_GATEWAY}${cid}`;
}

/**
 * Check if IPFS is configured
 */
export function isIPFSConfigured(): boolean {
  return !!(PINATA_API_KEY && PINATA_SECRET_API_KEY);
}
