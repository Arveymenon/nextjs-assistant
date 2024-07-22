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
  if (!messages.length) {
    return null
  }

  let [ instructions, setInstructions ] = useState("")

  useEffect(()=>{
    console.log(config)
    if(config.instructions){
      const formattedContent = config.instructions.replace(/\n/g, '<br>');
      // Sanitize the content
      const cleanHtml = DOMPurify.sanitize(formattedContent);
      setInstructions(cleanHtml)
    }
  },[config])

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
    //   <div className="flex justify-center">
    //     <div className="relative max-w-2xl px-8">
    //       {instructions && 
    //         <div className="absolute left-0 transform -translate-x-full mr-4 hidden lg:block" style={{"width": "24vw"}}>
    //           <div className="rounded-lg border bg-background p-8">
    //             <p className="mb-2 leading-normal text-muted-foreground"
    //               dangerouslySetInnerHTML={{ __html: instructions }} />
    //           </div>
    //         </div>
    //       }
    //     {
    //     (config.welcome_text || config.welcome_subtext) && 
    //       <div className="p-8">
    //         {messages.map((message, index) => (
    //           <div key={index}>
    //             <ChatMessage message={message} config={config}/>
    //             {index < messages.length - 1 && (
    //               <Separator className="my-4 md:my-8" />
    //             )}
    //           </div>
    //         ))}
    //       </div>
    //     }
    //   </div>
    // </div>
  )
}
