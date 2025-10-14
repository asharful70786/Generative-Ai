import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI();
const speechFile = path.resolve("./speech.mp3");

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream("./speech.mp3"),
  model: "gpt-4o-transcribe",
});

console.log(transcription.text);