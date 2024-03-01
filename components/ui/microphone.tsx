"use client";

import { useRecordVoice } from "@/lib/hooks/speech-to-text";
import { IconChevronUpDown } from "./icons";
import React, { useRef } from "react";

type MicrophoneProps = {
    onSubmit: (x: string) => void
}

const Microphone = ({onSubmit}: MicrophoneProps) => {
    const { startRecording, stopRecording, text, setText: microPhoneText } = useRecordVoice();
    const submitButtonRef = React.useRef<HTMLButtonElement>(null)

    if(text) {
        onSubmit(text)
        microPhoneText("")
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className="border-none bg-transparent w-10"
                >
                <IconChevronUpDown />
                </button>
            </div>
        </>
    );
  };
  
  export { Microphone };