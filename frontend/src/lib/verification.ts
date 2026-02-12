// frontend/src/lib/verification.ts
import CryptoJS from "crypto-js";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

/**
 * Hash an image using SHA-256
 */
export async function hashImage(base64Image: string): Promise<string> {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const hash = CryptoJS.SHA256(base64Data).toString();
  return hash;
}

/**
 * Create a verification record
 */
export async function createVerification(data: {
  userId: string;
  imageHash: string;
  imageBase64: string;
  location?: { lat: number; lng: number } | null;
  isPrivate?: boolean;
}): Promise<any> {
  try {
    const response = await axios.post(
      `${API_URL}/api/verification/create`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to create verification"
    );
  }
}

/**
 * Verify an image hash
 */
export async function verifyImageHash(imageHash: string): Promise<any> {
  try {
    const response = await axios.post(`${API_URL}/api/verification/verify`, {
      imageHash,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to verify image");
  }
}

/**
 * Get user's verifications
 */
export async function getUserVerifications(userId: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `${API_URL}/api/verification/user/${userId}`
    );
    return response.data.verifications;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to get verifications"
    );
  }
}

/**
 * Get current geolocation
 */
export async function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      }
    );
  });
}
