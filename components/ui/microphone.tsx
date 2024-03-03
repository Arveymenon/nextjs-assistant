"use client";

import { useRecordVoice } from "@/lib/hooks/speech-to-text";
import { IconArrowElbow, IconMic } from "./icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type MicrophoneProps = {
    onSubmit: (x: string) => void
    disabled: boolean
}

const Microphone = ({onSubmit, disabled}: MicrophoneProps) => {
    const { startRecording, stopRecording, text, setText: microPhoneText } = useRecordVoice();
    const submitButtonRef = React.useRef<HTMLButtonElement>(null)
    const [recording, setRecording] = useState<boolean>(false)
    if(text) {
        onSubmit(text)
        microPhoneText("")
    }

    const clickHandler = () => {
        recording ? stopRecording() : startRecording()
        setRecording(!recording)
    }

    return (
        <>
            
                <Button
                    className="prevent-select"
                    disabled={disabled}
                    size="icon"
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    >
                <IconMic />
                <span className="sr-only">Send message</span>
                </Button>
            
            {/* <button
                className="prevent-select"
                disabled={disabled}
                onClick={clickHandler}
                >
                Mic Button
            </button> */}
        </>
    );
  };
  
  export { Microphone };