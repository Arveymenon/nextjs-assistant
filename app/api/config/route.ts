import clientConfigDatabase, { ClientConfig } from "@/lib/Database/ChatBotConfig/clientConfigDatabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, response: Response) {
    const body = (await req.json()) as ClientConfig;
    console.log("Body passed:", body)
    let config = await clientConfigDatabase.read(body.client)
    console.log("Currect config: ",config)
    let res
    if(config?.client_id){
        res = await clientConfigDatabase.update(body)
    } else {
        res = await clientConfigDatabase.create(body)
    }

    return NextResponse.json(res);
}

export async function GET(req: NextRequest) {
    console.log("GET CALL")
    console.log(req.url)
    // const { clientConfigId } = req.query; // Access query parameters
    const { searchParams } = new URL(req.url as string);
    const clientConfigId = searchParams.get('clientConfigId');
    console.log(clientConfigId)

    if (clientConfigId) {
        let config = await clientConfigDatabase.read(clientConfigId);
        console.log("Response: ", config)
        if (!config) {
            return NextResponse.json({ message: "No config exists" }, { status: 201 });
        } else {
            return NextResponse.json(config, { status: 200 });
        }
    } else {
        return NextResponse.json({ message: "Pass a client ID" }, { status: 401 });
    }
}