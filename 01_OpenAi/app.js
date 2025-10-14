import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], 
});


const response = await client.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "user", content: "Hello!" },
   { role: "assistant", content: "Hi!" },
   {role : "system", content: "You are a software engineer who is helpful assistant."}
  ],
});

console.log(response);