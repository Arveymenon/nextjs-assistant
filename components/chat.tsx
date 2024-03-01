'use client'

import { useChat, type Message, experimental_useAssistant as useAssistant } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import { useTts } from 'tts-react'
import TextToSpeech from '@/lib/hooks/text-to-speech'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ initialMessages, className }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [ previewTokenDialog, setPreviewTokenDialog ] = useState(IS_PREVIEW)
  const [ previewTokenInput, setPreviewTokenInput ] = useState(previewToken ?? '')

  const [ textToBeSpoken, setTextToBeSpoken ] = useState<string>("")
  const { status, messages, input, submitMessage, handleInputChange, setInput, threadId } = useAssistant(
    { 
      api: '/api/chat'
    }
  );

  useEffect(()=>{
    if (messages.length && messages[messages.length-1].role === "assistant") {
      console.log("assistant has sent a message", messages)
      setTextToBeSpoken(messages[messages.length-1].content)
    }
  }, [messages])

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={status === 'in_progress'} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      {textToBeSpoken && 
        <TextToSpeech textToBeSpoken={textToBeSpoken} setTextToBeSpoken={setTextToBeSpoken}></TextToSpeech>
      }
      <ChatPanel
        id={threadId}
        status={status}
        submitMessage={submitMessage}
        messages={messages}
        input={input}
        setInput={setInput}
        handleInputChange={handleInputChange}
      />
    </>
  )
}
