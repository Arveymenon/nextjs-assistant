import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

import { useTts } from 'tts-react'

import { useCallback, useEffect, useState } from 'react'
import TextToSpeech from '@/lib/hooks/text-to-speech'

const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]

const titleText = "Hi! My Name's Juliana. How can I help you?"
const subText = "Hold down the mic icon to talk to our assistant."


export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {

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
        {/* <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div> */}
      </div>
    </div>
  )
}
