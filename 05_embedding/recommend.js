// recommend.mjs
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// cosine style similarity -> getting similarity between two vectors
function dotSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v ** 2, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v ** 2, 0));
  return dot / (magA * magB);
}


const embedPath = path.join(import.meta.dirname, "embeddings", "embeddings.json");
const fruits = JSON.parse(fs.readFileSync(embedPath, "utf-8"));

async function getQueryEmbedding(query) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  return res.data[0].embedding;
}

async function recommend(query) {
  const queryEmbedding = await getQueryEmbedding(query);

  const scores = fruits.map(fruit => ({
    name: fruit.name,
    description: fruit.description,
    score: dotSimilarity(queryEmbedding, fruit.embedding),
  }));

  scores.sort((a, b) => b.score - a.score);
  const top = scores;

  console.log(`🔍 Query: ${query}`);
  console.log(scores.slice(0, 10).map(f => `${f.name} (${f.score.toFixed(3)})`));
  console.log(`📖 ${top.description}\n`);

  // // Optional friendly text via GPT
  // const chat = await client.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     { role: "system", content: "You are a helpful product recommender." },
  //     {
  //       role: "user",
  //       content: `User searched for: "${query}". Best match: "${top.name}" - "${top.description}". Write a short friendly 2-line recommendation.`,
  //     },
  //   ],
  // });

  // console.log(` Recommendation:\n${chat.choices[0].message.content}`);
}

recommend("sweet yellow fruit full of potassium");
