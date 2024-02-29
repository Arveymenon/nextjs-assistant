import { NextResponse } from "next/server";
import fs from "fs";
import OpenAI, { toFile } from "openai";

import { put, del } from "@vercel/blob";

import { get } from 'https'
import { Readable } from 'stream'

import axios from 'axios'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request, response: Response) {
  const body = await req.json();
  
  const base64Audio = body.audio;

  // Convert the base64 audio data to a Buffer
  const audio = Buffer.from(base64Audio, "base64");
  
  const fileName = (Math.random()*100) + "input.wav"
  const filePath = `tmp/${fileName}`;
  
  // Define the file path for storing the temporary WAV file
  
  try {
      let file, data;
      
      if (process.env.NODE_ENV === "development" && false) {
          // Write the audio data to a temporary WAV file synchronously
          createDirectoryIfNotExists("tmp")
          // Create a readable stream from the temporary WAV file
          fs.writeFileSync(filePath, audio);
        
        file = fs.createReadStream(filePath);
        data = await openai.audio.transcriptions.create({
            file: file,
            model: "whisper-1"
        });
        // Remove the temporary file after successful processing
        fs.unlinkSync(filePath);
    } else {
        const { url } = await put(filePath, audio, { access: 'public' });

        console.log("The Speech URL", url)
        const { data: fileData } = await axios.get(url, {
            responseType: 'arraybuffer',
        });

        const file = await toFile(Buffer.from(fileData), fileName);
        data = await openai.audio.transcriptions.create({
            file: file,
            model: "whisper-1"
        });
        del(url);
    }
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