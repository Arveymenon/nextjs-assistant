"use client";

import { useRecordVoice } from "@/lib/hooks/speech-to-text";
import { IconChevronUpDown } from "./icons";

type MicrophoneProps = {
    onSubmit: (value: string) => void
}

const Microphone = ({onSubmit}: MicrophoneProps) => {
    const { startRecording, stopRecording, text, setText } = useRecordVoice();

    if(text) {
        onSubmit(text)
        setText("")
    }

    return (
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
        {/* <p>{text}</p> */}
      </div>
    );
  };
  
  export { Microphone };