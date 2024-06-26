import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

type ImageUploaderProps = {
    id? : string,
    value?: string | File,
    onChange: (x: File| string)=> void,
}

const ImageUploader = ({
    id = "",
    value,
    onChange
}: ImageUploaderProps) => {

    const [imageUrl, setImageUrl] = useState(value)

    useEffect(()=>{
        if(value && !(value instanceof File))
            setImageUrl(value)
        },[value])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
                value
                onChange(file);
            }
            reader.readAsDataURL(file);
        }
    }
    
    return (
        <>
            <input type="file" accept="image/*" id={id} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                onChange={handleFileChange}
            />
            {(imageUrl && !(imageUrl instanceof File)) &&
                <div className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                    <Image src={imageUrl} className="w-[180px]" alt=""/>
                </div>
            }
        </>
    )
}

export default ImageUploader