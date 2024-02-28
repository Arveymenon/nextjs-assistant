import { NextResponse } from "next/server";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  
  const base64Audio = body.audio;

  // Convert the base64 audio data to a Buffer
  const audio = Buffer.from(base64Audio, "base64");

  createDirectoryIfNotExists("tmp")
  // Define the file path for storing the temporary WAV file
  const filePath = "tmp/input.wav";

  try {
    // Write the audio data to a temporary WAV file synchronously
    fs.writeFileSync(filePath, audio);

    // Create a readable stream from the temporary WAV file
    // const readStream = fs.createReadStream(filePath);
    // setTimeout(async ()=>{
    // }, 2000)
    
    const data = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1"
    });

    // Remove the temporary file after successful processing
    fs.unlinkSync(filePath);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
}

function createDirectoryIfNotExists(directoryPath: string) {
    // Check if the directory already exists
    if (!fs.existsSync(directoryPath)) {
      // If not, create the directory
      fs.mkdirSync(directoryPath);
      console.log(`Directory created: ${directoryPath}`);
    } else {
      console.log(`Directory already exists: ${directoryPath}`);
    }
  }