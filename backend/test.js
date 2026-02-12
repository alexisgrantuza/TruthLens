import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.HF_API_KEY || "";
console.log(API_KEY);

async function query(imageData) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/umm-maybe/AI-image-detector",
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "image/jpeg",
      },
      method: "POST",
      body: imageData, // Send binary data directly, NOT JSON.stringify
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result;
}

// Read the image file from the same directory as this script
const imagePath = path.join(__dirname, "cats.jpg");

if (!fs.existsSync(imagePath)) {
  console.error(`Error: File not found at ${imagePath}`);
  process.exit(1);
}

console.log(`Reading image from: ${imagePath}`);
const imageData = fs.readFileSync(imagePath);
console.log(`Image size: ${imageData.length} bytes`);

query(imageData)
  .then((response) => {
    console.log("Success! Response:");
    console.log(JSON.stringify(response, null, 2));
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
