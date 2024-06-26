import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const config = {
    api: {
       bodyParser: false,
    },
};

export async function POST(request: Request): Promise<NextResponse> {
    // let req = await request.json()
    // const imageFile = req.file as File;

    let newFormData = (await request.formData());
    // newFormData.keys();
    
    Array.from(newFormData.keys()).forEach(async (key) => {
      console.log(key);
      newFormData.get('filename');
      // (await request.formData()).get(key)
    });

    // const buffer = await request.rawBody.getReader().read();
    // const formData = await FormData.parse(buffer);
    const imageFile = newFormData.get('file') as File;
    const filename = newFormData.get('filename') as string;
    const fileResponseData = await put(filename, imageFile, {
        access: 'public',
        multipart: true,
    });
    
    return NextResponse.json(fileResponseData);
}
