"use client";

import { useRecordVoice } from "@/lib/hooks/speech-to-text";
import { IconArrowElbow, IconMic } from "./icons";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type MicrophoneProps = {
    onSubmit: (x: string) => void
    disabled: boolean,
    recording: boolean,
    setRecording: React.Dispatch<React.SetStateAction<boolean>>
}

const Microphone = ({onSubmit, disabled, recording, setRecording}: MicrophoneProps) => {
    const { startRecording, stopRecording, text, setText: microPhoneText } = useRecordVoice();

    if(text) {
        onSubmit(text)
        microPhoneText("")
    }

    const tapHandler = () => {
        recording ? stopRecording() : startRecording()
        setRecording(!recording)
    }

    return (
        <>
            <Button
                className="prevent-select"
                disabled={disabled}
                size="icon"
                onMouseDown={tapHandler}
                onMouseUp={tapHandler}
                onTouchStart={tapHandler}
                onTouchEnd={tapHandler}
                >
            <IconMic />
            <span className="sr-only">Send message</span>
            </Button>
        </>
    );
  };
  
  export { Microphone };