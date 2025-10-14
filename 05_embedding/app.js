import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const dataPath = path.join(import.meta.dirname, "embeddings", "data.json");
const fruitsData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));


// Function to get embedding from OpenAI
async function getEmbedding(text) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

async function run() {
  const results = [];

  // Loop through all fruits and get embeddings
  for (const fruit of fruitsData) {
    const text = `${fruit.description}`;
    const embedding = await getEmbedding(text);

    results.push({
      id: fruit.id,
      name: fruit.name,
      description: fruit.description,
      embedding,
    });

    console.log(`✅ Embedded: ${fruit.name}`);
  }

  const outPath = path.join(import.meta.dirname, "embeddings", "embeddings.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");

  console.log(`🎉 Saved ${results.length} embeddings to ${outPath}`);
}

run().catch(console.error);
