"use client"
import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { useEffect, useState } from 'react'

import DOMPurify from 'dompurify';

export interface ChatList {
  messages: Message[]
  config: any
}

export function ChatList({ messages, config }: ChatList) {
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (config.instructions) {
      const formattedContent = config.instructions.replace(/\n/g, '<br>');
      const cleanHtml = DOMPurify.sanitize(formattedContent);
      setInstructions(cleanHtml);
    }
  }, [config]);

  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative">
           {instructions && 
            <div className="fixed px-4 hidden lg:block" style={{"width": "24vw"}}>
              <div className="rounded-lg border bg-background p-8">
                <p className="mb-2 leading-normal text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: instructions }} />
              </div>
            </div>
          }
        <div className="relative mx-auto max-w-2xl px-4 pt-4">
          {messages.map((message, index) => (
            <div key={index}>
              <ChatMessage message={message} config={config}/>
              {index < messages.length - 1 && (
                <Separator className="my-4 md:my-8" />
              )}
            </div>
          ))}
        </div>
    </div>
  )
}
