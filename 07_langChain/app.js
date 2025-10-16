import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });

async function run() {
  
  // calling methods from langchain

  const res = await model.invoke("ok now tell me why langchain is better and good desition to use it in my project in short and simple way.");


  // batch msg call

  const res2 =await model.batch([
    "china capital name",
    "india capital name"
  ])


//  Response in Chunk
 const res3 = await  model.stream("what is the capital of india  describe in 100 words");
 for await (let chunk of res ){
  console.log(chunk.content);
 }

  
}

// run();





