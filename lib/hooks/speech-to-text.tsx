"use client";
import { useEffect, useState, useRef } from "react";
import { createMediaStream } from "../createMediaStream";
import { blobToBase64 } from "../blobToBase65";
// import { blobToBase64 } from "@/utils/blobToBase64";

export const useRecordVoice = () => {
  // State to hold the media recorder instance
  const [text, setText] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

  // State to track whether recording is currently in progress
  const [recording, setRecording] = useState(false);
  const isRecording = useRef(false);

  // Ref to store audio chunks during recording
  const chunks = useRef<Blob[]>([]);

  // Function to start the recording
  const startRecording = () => {
    if (mediaRecorder) {
      isRecording.current = true;
      mediaRecorder.start();
      setRecording(true);
    }
  };

  // Function to stop the recording
  const stopRecording = () => {
    if (mediaRecorder) {
      isRecording.current = false;
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const getText = async (base64data: string) => {
    try {
      const response = await fetch("/api/speechToText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64data,
        }),
      }).then((res) => res.json());
      const { text } = response;
      setText(text);
    } catch (error) {
      console.log(error);
    }
  };

  const initialMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      createMediaStream(stream)
      chunks.current = [];
    };

    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      blobToBase64(audioBlob, getText);
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);

  return { recording, startRecording, stopRecording, text, setText };
};