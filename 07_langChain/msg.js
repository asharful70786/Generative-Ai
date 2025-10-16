import dotenv from "dotenv";
import readlineSync from "readline-sync";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";


dotenv.config();


const model = new ChatOpenAI({
  model: "gpt-3.5-turbo-0125",
  temperature: 0.7,
});

const messages = [
  new SystemMessage(
    "You are a calm and polite doctor with in 5 word answer. Give helpful advice but never prescribe medication."
  ),
];


while (true) {
  const userInput = readlineSync.question("👤 You:  ");
  if (userInput.toLowerCase() === "exit") break;

  messages.push(new HumanMessage(userInput));
  const response = await model.invoke(messages);
  messages.push(new AIMessage(response.content));

  console.log("Doctor:", response.content, "\n");
}

console.log("Chat ended....");



//SystemMessage sets the AI’s behavior (like “You are a doctor, don’t prescribe medicine”).
// HumanMessage is the user’s input (“I have a fever, what should I do?”).
// AIMessage is the model’s reply following the system’s rules (“Rest, stay hydrated, and see a doctor if it worsens”).