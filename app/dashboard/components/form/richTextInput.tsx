'use client'

import { ChangeEvent, KeyboardEvent, useEffect } from "react"
import { 
    BtnBold,
    BtnItalic,
    ContentEditableEvent,
    Editor,
    EditorProvider,
    Toolbar,
    BtnBulletList,
    BtnNumberedList
  } from 'react-simple-wysiwyg';

type InputProps = {
    id? : string,
    value?: string,
    onChange: (x: string)=> void,
}

const RichTextInput = ({
    id = "",
    value,
    onChange
}: InputProps) => {

    const handleChange = (e: any) => {
        console.log("typeof e", typeof e)
        console.log(e)

        e.preventDefault()
        onChange(e.target.value)
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }
    
    const contentEdited = (event: ContentEditableEvent) => {
        console.log(event)
        // onChange()
    }
    const testChange = (a: ContentEditableEvent) => {
        console.log(a)
        onChange(a.target.value)
    }

    return (
        // <div className="text-gray-800">
        //     <EditorProvider>
        //         <Editor value={value} onChange={testChange}>
        //         <Toolbar>
        //             <BtnBold />
        //             <BtnItalic />
        //             <BtnBulletList/>
        //             <BtnNumberedList/>
        //         </Toolbar>
        //         </Editor>
        //     </EditorProvider>
        // </div>
        <textarea id={id} className="mt-1 p-3 block w-full rounded-md border-gray-300 text-lg bg-white text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={value} onChange={handleChange}
            rows={5}
        />
    )
}

export default RichTextInput