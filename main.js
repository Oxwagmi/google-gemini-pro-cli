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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, ".env");

dotenv.config({ path: envPath });

let conversationHistory = [];

const generationConfig = {
  maxOutputTokens: 200,
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
  model: "gemini-pro",
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

async function main() {
  while (true) {
    const prompt = await askQuestion(">");

    if (prompt.toLowerCase() === "exit") {
      rl.close();
      process.exit(0);
    }

    try {
      await generateAndPrintResponse(prompt);
    } catch (error) {
      console.error(error);
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
