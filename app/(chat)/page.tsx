import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'

export default function IndexPage() {
  // const id = nanoid()

  const id = ""

  return <Chat id={id} />
}
