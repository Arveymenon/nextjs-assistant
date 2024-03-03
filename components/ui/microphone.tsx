"use client";

import { useRecordVoice } from "@/lib/hooks/speech-to-text";
import { IconArrowElbow, IconMic } from "./icons";
import React from "react";
import { Button } from "@/components/ui/button";

type MicrophoneProps = {
    onSubmit: (x: string) => void
    disabled: boolean
}

const Microphone = ({onSubmit, disabled}: MicrophoneProps) => {
    const { startRecording, stopRecording, text, setText: microPhoneText } = useRecordVoice();
    const submitButtonRef = React.useRef<HTMLButtonElement>(null)

    if(text) {
        onSubmit(text)
        microPhoneText("")
    }

    return (
            <Button
                    disabled={disabled}
                    size="icon"
                    type="submit"
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    >
                <IconMic />
                {/* <IconArrowElbow /> */}
                <span className="sr-only">Send message</span>
            </Button>
    );
  };
  
  export { Microphone };