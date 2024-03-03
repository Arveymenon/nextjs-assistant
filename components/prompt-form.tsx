import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { UseAssistantHelpers, UseChatHelpers } from 'ai/react'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'
import { Microphone } from './ui/microphone'

export interface PromptProps
  extends Pick<UseAssistantHelpers, 'input' | 'setInput'> {
  submitMessage: (e: React.FormEvent<HTMLFormElement>) => void,
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  isLoading: boolean
}

export function PromptForm({
  submitMessage,
  handleInputChange,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const submitButtonRef = React.useRef<HTMLButtonElement>(null)
  const router = useRouter()

  const [ microphoneUsed, setMicrophoneUsed ] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input?.trim()) {
      return
    }
    setInput('')
    await submitMessage(e)
  }

  React.useEffect(() => {
    if (input && microphoneUsed) {
      setMicrophoneUsed(false)
      // Trigger form submission
      submitButtonRef.current?.click();
    }
  }, [input, microphoneUsed]);

  return (
    <form
      onSubmit={formSubmit}
      ref={formRef}
    >
      <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border pr-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => {
            setInput(e.target.value)
            handleInputChange(e)
          }}
          placeholder="Send a message"
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
      <div className="absolute top-4 right-[3.5rem]">
        <Tooltip>
          <TooltipTrigger asChild>
              <Microphone
                  disabled={isLoading} onSubmit={(text)=> {
                  setInput(text)
                  setMicrophoneUsed(true)
                }}/>
          </TooltipTrigger>
          <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
        <div className="absolute top-4 right-0 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                ref={submitButtonRef}
                type="submit"
                size="icon"
                disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>

    </form>
  )
}
