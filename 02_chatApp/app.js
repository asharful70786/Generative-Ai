import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

// Start context with system role
const context = [
  { role: "system", content: "You are a helpful assistant who is also a software engineer." }
];

// Function to call OpenAI
async function getChatCompletion(userInput) {
  // Push new user message into context
  context.push({ role: "user", content: userInput });

  // Call OpenAI
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });

  const responseMsg = response.choices[0].message.content;

  // Save assistant’s reply in context too
  context.push({ role: "assistant", content: responseMsg });

  return responseMsg;
}

// Route for chatting
app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body.userInput;
    console.log("User:", userInput);

    const aiResponse = await getChatCompletion(userInput);

    // Send conversation snippet back
    res.send(`
      <h2>User: ${userInput}</h2>
      <h2>Assistant: ${aiResponse}</h2>
      <a href="/">Go Back</a>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.get("/", (req, res) => {
  res.send(`
    <form action="/chat" method="post">
      <input type="text" name="userInput" />
      <button type="submit">Send</button>
    </form>
  `);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
