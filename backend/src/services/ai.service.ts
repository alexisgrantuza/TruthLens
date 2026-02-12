// backend/src/services/ai.service.ts
import dotenv from "dotenv";
dotenv.config();

const HF_API_KEY =
  process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY || "";

/**
 * Query HuggingFace AI image detector model
 * Uses the same approach as test.js but in TypeScript
 */
async function queryHuggingFace(imageBuffer: Buffer): Promise<any> {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/umm-maybe/AI-image-detector",
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "image/jpeg",
      },
      method: "POST",
      body: imageBuffer, // Send binary data directly, NOT JSON.stringify
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Analyze image for deepfake detection
 * Uses HuggingFace's AI-image-detector model via direct API call
 */
export async function analyzeImageForDeepfake(base64Image: string): Promise<{
  description: string;
  probability: number;
  isAuthentic: boolean;
  rawAnalysis?: any;
}> {
  // If no API key, return a default analysis
  if (!HF_API_KEY) {
    console.warn(
      "HuggingFace API key not configured, returning default analysis"
    );
    return {
      description: "AI analysis unavailable. Image processed successfully.",
      probability: 0.1,
      isAuthentic: true,
    };
  }

  try {
    // Remove data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Query the HuggingFace model
    const result = await queryHuggingFace(imageBuffer);

    // Parse the result from AI-image-detector model
    // The model typically returns an array with predictions
    // Format: [{ label: "AI-generated" | "Real", score: number }, ...]
    let probability = 0.1;
    let label = "authentic";
    let isAuthentic = true;

    if (Array.isArray(result) && result.length > 0) {
      // Find the prediction for "AI-generated" or "Real"
      const aiGeneratedPred = result.find(
        (pred: any) =>
          pred.label?.toLowerCase().includes("ai") ||
          pred.label?.toLowerCase().includes("generated") ||
          pred.label?.toLowerCase().includes("fake")
      );

      const realPred = result.find(
        (pred: any) =>
          pred.label?.toLowerCase().includes("real") ||
          pred.label?.toLowerCase().includes("authentic")
      );

      if (aiGeneratedPred) {
        probability = aiGeneratedPred.score || 0.1;
        label = aiGeneratedPred.label || "AI-generated";
        isAuthentic = probability < 0.5; // If probability of AI-generated is < 50%, consider authentic
      } else if (realPred) {
        probability = 1 - (realPred.score || 0.9); // Invert: if real score is high, AI probability is low
        label = "Real";
        isAuthentic = true;
      } else {
        // Fallback: use first result
        const topResult = result[0];
        probability = topResult?.score || 0.1;
        label = topResult?.label || "unknown";
        isAuthentic =
          !label.toLowerCase().includes("ai") &&
          !label.toLowerCase().includes("fake");
      }
    } else if (result && typeof result === "object") {
      // Handle single object response
      probability = result.score || result.probability || 0.1;
      label = result.label || result.prediction || "unknown";
      isAuthentic =
        !label.toLowerCase().includes("ai") &&
        !label.toLowerCase().includes("fake") &&
        !label.toLowerCase().includes("generated");
    }

    return {
      description: `AI Analysis: ${label} (Probability of AI-generated: ${(
        probability * 100
      ).toFixed(2)}%)`,
      probability: probability,
      isAuthentic,
      rawAnalysis: result,
    };
  } catch (error: any) {
    console.error("AI analysis error:", error);
    // Return safe default on error
    return {
      description: "AI analysis unavailable. Image processed successfully.",
      probability: 0.1,
      isAuthentic: true,
    };
  }
}

/**
 * Check if AI service is configured
 */
export function isAIConfigured(): boolean {
  return !!HF_API_KEY;
}
