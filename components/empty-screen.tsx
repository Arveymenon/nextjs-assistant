import { UseChatHelpers } from 'ai/react'
import { useEffect, useState } from 'react'

import DOMPurify from 'dompurify';

export function EmptyScreen({config}: any) {

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
        {
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
          }
    </div>

    
    // <div className="flex justify-center">
    //   <div className="relative max-w-2xl px-4">
    //     {instructions && 
    //       <div className="absolute left-0 transform -translate-x-full mr-4 hidden lg:block" style={{"width": "24vw"}}>
    //         <div className="rounded-lg border bg-background p-8">
    //           <p className="mb-2 leading-normal text-muted-foreground"
    //             dangerouslySetInnerHTML={{ __html: instructions }} />
    //         </div>
    //       </div>
    //     }
    //     {
    //     (config.welcome_text || config.welcome_subtext) && 
    //       <div className="rounded-lg border bg-background p-8">
    //         <h1 className="mb-2 text-lg font-semibold">
    //           {config.welcome_text}
    //         </h1>
    //         <p className="mb-2 leading-normal text-muted-foreground">
    //           {config.welcome_subtext}
    //         </p>
    //       </div>
    //     }
    //   </div>
    // </div>
  )
}
