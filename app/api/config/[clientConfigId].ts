import clientConfigDatabase from "@/lib/Database/ChatBotConfig/clientConfigDatabase";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query)
  const { clientConfigId } = req.query; // Access query parameters
  if(clientConfigId){
    let config = clientConfigDatabase.read(clientConfigId as string)
    // Example: Return the query parameters in the response
    if(!config) {
      res.status(201).json({message: "No config exists"});
    } else {
      res.status(200).json(config);
    }
  } else {
    res.status(401).json({message: "Pass a client ID"});
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log("GET CALL")
  console.log(req.query)
  const { clientConfigId } = req.query; // Access query parameters
  if(clientConfigId){
    let config = clientConfigDatabase.read(clientConfigId as string)
    // Example: Return the query parameters in the response
    if(!config) {
      res.status(201).json({message: "No config exists"});
    } else {
      res.status(200).json(config);
    }
  } else {
    res.status(401).json({message: "Pass a client ID"});
  }
}