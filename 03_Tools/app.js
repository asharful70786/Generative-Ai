import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});


function CaliforniaTime() {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
}

async function openAi() {
  // Step 1: Ask model
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "what is the time now in california" },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "CaliforniaTime",
          description: "Get the current time in California",
          parameters: { type: "object", properties: {} },
        },
      },
    ],
    tool_choice: "auto",
  });

  const msg = response.choices[0].message;


  if (msg.tool_calls) {
    for (const toolCall of msg.tool_calls) {
      if (toolCall.function.name === "CaliforniaTime") {
        const result = CaliforniaTime();
        const secondResponse = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "what is the time now in california" },
            msg, 
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: result,
            },
          ],
        });

        return secondResponse.choices[0].message.content;
      }
    }
  } else {
    return msg.content;
  }
}

openAi().then((data) => console.log("AI says:", data));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
