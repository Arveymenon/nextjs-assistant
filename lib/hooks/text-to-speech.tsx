import { Dispatch, SetStateAction, useCallback, useEffect } from "react"
import { useTts } from "tts-react"

type TextToSpeech = {
  textToBeSpoken: string
  setTextToBeSpoken: Dispatch<SetStateAction<string>>
}



const TextToSpeech = ({textToBeSpoken, setTextToBeSpoken}: TextToSpeech) => {
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find((voice) => voice.name === 'Samantha');

  if(selectedVoice) {
    console.log(selectedVoice)
    const { ttsChildren, play } = useTts({
      children: textToBeSpoken,
      rate: 0.7,
      markTextAsSpoken: false,
      voice: selectedVoice,
      onEnd: useCallback(() => {
        setTextToBeSpoken("")
      }, [])
    })
  
    useEffect(()=>{
      if (textToBeSpoken) {
        play()
        // setTimeout(()=>{
        // },1000)
      }
    },[ttsChildren])
  
    return <span style={{display: "none"}}>{ttsChildren}</span>
  } else {
    return <></>
  }
}

export default TextToSpeech