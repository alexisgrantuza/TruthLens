import { InferenceClient } from "@huggingface/inference";

const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN;
if (!token) throw new Error("Set HF_TOKEN or HUGGINGFACE_TOKEN");
const client = new InferenceClient(token);

const data = fs.readFileSync("cats.jpg");

const output = await client.imageClassification({
  data,
  model: "Ateeqq/ai-vs-human-image-detector",
  provider: "hf-inference",
});

console.log(output);
