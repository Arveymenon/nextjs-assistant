'use client'

import { type Message, experimental_useAssistant as useAssistant } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import TextToSpeech from '@/lib/hooks/text-to-speech'
import { ClientConfig } from '@/lib/Database/ChatBotConfig/clientConfigDatabase'
import SetCustomTheme from '@/lib/common/theme'
import ChatHeader from '@/components/chat-header'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const Features = {
    voiceChat: false
  }
  const [ previewTokenDialog, setPreviewTokenDialog ] = useState(IS_PREVIEW)
  const [ previewTokenInput, setPreviewTokenInput ] = useState(previewToken ?? '')
  const [ config, setConfig ] = useState<any>({
    client: ''
  })

  const [ textToBeSpoken, setTextToBeSpoken ] = useState<string>("")
  const { status, messages, input, submitMessage, handleInputChange, setInput, threadId } = useAssistant(
    { 
      api: '/api/chat'
    }
  );

  useEffect(()=>{
    if (Features.voiceChat && messages.length && messages[messages.length-1].role === "assistant") {
      setTextToBeSpoken(messages[messages.length-1].content)
    }

  }, [Features.voiceChat, messages])
  
  useEffect(()=>{
    fetch('/api/config?clientConfigId=1', {
      method: "GET"
    }).then(async (res: Response)=>{
        let response = await res.json()
        setConfig(response)
        SetCustomTheme(response.theme)
    })
  }, [])

  return (
    <>
      <div className={cn('pb-[200px] md:pt-10', className)}>
        {
          (config.logo_client || config.logo_customer) &&
          <ChatHeader config={config}/>
        }
        {messages.length ? (
          <>
            <ChatList messages={messages} config={config}/>
            <ChatScrollAnchor trackVisibility={status === 'in_progress'} />
          </>
        ) : (
          <EmptyScreen config={config}/>
        )}
      </div>
      {Features.voiceChat && textToBeSpoken && 
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
        voiceChatEnabled={Features.voiceChat}
        config={config}
      />
    </>
  )
}
