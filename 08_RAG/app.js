import dotenv from "dotenv";
import fs from "fs";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();


const rawData = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));
const allText = rawData.map(item => item.text).join("\n");

// console.log(rawData)


const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.2,
});


const prompt = ChatPromptTemplate.fromTemplate(`
You are an assistant that answers questions based only on the following hospital data:
{context} Question: {question}
Answer only using the data above. If not found, say "Not in provided data."
`);

const chain = prompt.pipe(model);


const question = "What  is our hospital name  and number";
const response = await chain.invoke({
  context: allText,
  question,
});

console.log("Q:", question);
console.log("A:", response.content);
