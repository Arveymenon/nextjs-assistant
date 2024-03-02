import { AssistantMessage } from 'ai'
import OpenAI from 'openai'
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages'

const assistantResponse = async (
  threads: OpenAI.Beta.Threads,
  threadId: string,
  createdMessage: OpenAI.Beta.Threads.Messages.ThreadMessage,
  sendMessage: (message: AssistantMessage) => void
) => {
  const responseMessages = (
    await threads.messages.list(threadId, {
      after: createdMessage.id,
      order: 'asc'
    })
  ).data

  console.log(new Date(), 'Sending Response responseMessages', responseMessages)
  // Send the messages

  for (const message of responseMessages) {
    console.log(
      new Date(),
      '------------------------ ResponseMessages ------------------------'
    )
    console.log(new Date(), message.content)
    sendMessage({
      id: message.id,
      role: 'assistant',
      content: message.content.filter(
        content => content.type === 'text'
      ) as Array<MessageContentText>
    })
  }
  return responseMessages;
}

export default assistantResponse
