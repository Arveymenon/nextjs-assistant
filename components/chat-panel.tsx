import * as React from 'react'
import { UseAssistantHelpers, type UseChatHelpers } from 'ai/react'

// import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconShare, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'

export interface ChatPanelProps
  extends Pick<
  UseAssistantHelpers,
    | 'status'
    | 'submitMessage'
    | 'handleInputChange'
    | 'messages'
    | 'input'
    | 'setInput'
    | 'voiceChatEnabled'
  > {
  id?: string
  title?: string
}

export function ChatPanel({
  id,
  title,
  status,
  submitMessage,
  handleInputChange,
  messages,
  input,
  setInput,
  voiceChatEnabled
}: ChatPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex items-center justify-center h-12">
          {status === 'in_progress' ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length >= 2 && (
              <div className="flex space-x-2">
                {id && title ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <IconShare className="mr-2" />
                      Share
                    </Button>
                  </>
                ) : null}
              </div>
            )
          )}
        </div>
        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            submitMessage={submitMessage}
            handleInputChange={handleInputChange}
            input={input}
            setInput={setInput}
            isLoading={status === 'in_progress'}
            voiceChatEnabled={voiceChatEnabled}
          />
        </div>
      </div>
    </div>
  )
}
