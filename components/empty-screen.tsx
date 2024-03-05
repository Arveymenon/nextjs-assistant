import { UseChatHelpers } from 'ai/react'
import { useState } from 'react'
import TextToSpeech from '@/lib/hooks/text-to-speech'

const titleText = "Hi! My Name's Juliana. How can I help you?"
const subText = "Hold down the mic icon to talk to our assistant."


export function EmptyScreen() {

  const [ textToBeSpoken, setTextToBeSpoken ] = useState(titleText)

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
            {titleText}
        </h1>
        {textToBeSpoken && 
          <TextToSpeech textToBeSpoken={textToBeSpoken} setTextToBeSpoken={setTextToBeSpoken}></TextToSpeech>
        }
        <p className="mb-2 leading-normal text-muted-foreground">
          {subText}
        </p>
      </div>
    </div>
  )
}
