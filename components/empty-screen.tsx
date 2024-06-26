import { UseChatHelpers } from 'ai/react'
import { useEffect, useState } from 'react'
import TextToSpeech from '@/lib/hooks/text-to-speech'

const titleText = "Hi! My Name's Juliana. How can I help you?"
const subText = "Hold down the mic icon to talk to our assistant."


export function EmptyScreen({config}: any) {

  useEffect(()=>{console.log(config)}, [config])

  return (
     (config.welcome_text || config.welcome_subtext) ?
      (<div className="mx-auto max-w-2xl px-4">
        <div className="rounded-lg border bg-background p-8">
          <h1 className="mb-2 text-lg font-semibold">
              {config.welcome_text}
          </h1>
          <p className="mb-2 leading-normal text-muted-foreground">
            {config.welcome_subtext}
          </p>
        </div>
      </div>) : <></>
  )
}
