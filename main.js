import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import readline from "readline";
import dotenv from "dotenv";
import spinners from "cli-spinners";
import chalk from "chalk";
import { highlight } from "cli-highlight";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { resolve } from "path";
import axios  from 'axios';
import fs from 'fs/promises';

import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, ".env");

dotenv.config({ path: envPath });

let conversationHistory = [];

const generationConfig = {
  maxOutputTokens: 400,
  temperature: 0.9,
  topP: 1,
  topK: 1,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const genAI = new GoogleGenerativeAI(process.env.API);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings,
  generationConfig,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function getRandomSpinner() {
  const spinnerOptions = ["dot", "pong", "shark", "monkey"];
  const randomIndex = Math.floor(Math.random() * spinnerOptions.length);
  if (randomIndex == 0) {
    return spinners.dots;
  } else if (randomIndex == 1) {
    return spinners.pong;
  } else if (randomIndex == 2) {
    return spinners.flip;
  } else {
    return spinners.monkey;
  }
}

const initialContext = `
You are interacting with a developer who is passionate about coding and technology. 
Keep in mind the following:
0. The user likes you to  communicate like  a sentiant or as a friend.
1. The user likes you to be named as Javis.
2. The user is a  developer with experience in various programming languages and interested in JavaScript,Rust and .
3. The user is particularly interested in AI, machine learning,Trading,Web3 Smart Contract development and security auditing, and cutting-edge tech.
4. The user enjoys discussing new programming techniques and best practices.
5. The user enjoys sometimes just chilling out and yapping about something funny.
5. The user appreciate concise, technical responses that get straight to the point.

Please tailor your responses to reflect this context and the user's background.
`;

async function generateAndPrintResponse(prompt) {
  const spinner = getRandomSpinner();
  let frameIndex = 0;
  const interval = setInterval(() => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${spinner.frames[frameIndex]} thinking..`);
    frameIndex = (frameIndex + 1) % spinner.frames.length;
  }, spinner.interval);
  try {
    const chat = model.startChat({
      history: conversationHistory,
    });
    if (conversationHistory.length === 0) {
      await chat.sendMessage(initialContext);
    }
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    clearInterval(interval);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const text = response.text();
    if(text){
      conversationHistory.push({ role: "user", parts: prompt });
      conversationHistory.push({ role: "model", parts: text });
    }
    if (text.includes("```")) {
      const startIndex = text.indexOf("```");
      const endIndex = text.indexOf("```", startIndex + 3);
      if (startIndex !== -1 && endIndex !== -1) {
        const codeBlock = text.slice(startIndex + 3, endIndex);
        console.log(
          highlight(codeBlock, { language: "javascript", ignoreIllegals: true })
        );
      }
    } else {
      console.log(chalk.blue("[+]" + text));
    }
  } catch (err) {
    console.log(err);
  }
}



function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function query(data) {
  const response = await axios({
    url: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.HUGFACE,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data),
    responseType: 'arraybuffer'
  });
  
  return response.data;
}
async function saveImage(imageData, filename) {
  const imagespath = resolve(__dirname, "images");
  const filepath = resolve(imagespath,filename);
  await fs.writeFile(filepath, imageData);
  console.log(`Image saved to ${filename}`);
  return filepath;
}

async function main() {
  while (true) {
    const prompt = await askQuestion(">");

    if (prompt.toLowerCase().startsWith("exit")) {
      rl.close();
      process.exit(0);
    }
else if  (prompt.toLowerCase().startsWith('imagine') || prompt.toLowerCase().includes('imagine')) {
  
  const cleanPrompt = prompt.toLowerCase().startsWith('imagine') 
    ? prompt.slice(7).trim() 
    : prompt; 

    const spinner = getRandomSpinner();
    let frameIndex = 0;
    const interval = setInterval(() => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`${spinner.frames[frameIndex]} dreaming...`);
      frameIndex = (frameIndex + 1) % spinner.frames.length;
    }, spinner.interval);
   
    const  imageData = await query({"inputs": cleanPrompt}); 
   
   clearInterval(interval);
   process.stdout.clearLine();
   process.stdout.cursorTo(0);

    const filename = `${cleanPrompt.replace(/\s+/g, '_')}.jpeg`;
    const filepath  =   await saveImage(imageData, filename);
  // const filepath  =   "/home/user/google-gemini-pro-cli/images/a_little_cat_saying_hellow_world_1725185502891.jpeg" ;
  const openImagePrompt = await askQuestion( "Do you want to open the image? (y/n): ");
  if (openImagePrompt.toLowerCase() === 'y') {
    exec(`eog ${filepath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error opening image: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        return;
      }
      console.log(`Image opened with eog`);
     return;
    });
  } else {
    console.log("Image not opened.");
    return
  }
 
  }
else {
  try {
    await generateAndPrintResponse(prompt);
  } catch (error) {
    console.error(error);
  }
}
  
  }
}

main()
  .then(() => {
    console.log("Program exited");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
