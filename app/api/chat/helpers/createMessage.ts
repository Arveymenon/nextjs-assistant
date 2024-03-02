import OpenAI from "openai";

export type Input = {
    threadId: string | null;
    message: string;
}

async function createMessage(threads: OpenAI.Beta.Threads, threadId: string, input: Input) {
    // Add a message to the thread
      const createdMessage = await threads.messages.create(threadId, {
        role: "user",
        content: input.message,
      });
      return createdMessage
}

export default createMessage;