import { experimental_AssistantResponse } from "ai";
import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import createMessage, { Input } from "./helpers/createMessage";
import  { createThreadRun, queuedOrInprogressRun } from "./helpers/threadRun";
import actionHandler from "./helpers/actionHandler";
import assistantResponse from "./helpers/assistantResponse";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
// export const runtime = "edge";
const threads = openai.beta.threads;

export async function POST(req: Request) {
  // Parse the request body
  const input: Input = await req.json();
  console.log(new Date(), "Request Initiated Input", input)
  // Create a thread if needed
  const threadId = input.threadId ?? (await threads.create({})).id;
  console.log(new Date(), "Thread Id", threadId)

  // Add a message to the thread
  const createdMessage = await createMessage(threads, threadId, input)
  console.log(new Date(), "Created message to be sent", input.message)

  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ threadId, sendMessage }) => {
      // Run the assistant on the thread
      const run = await createThreadRun(threads, threadId)
      console.log(new Date(),run.status, "run prepared. Thread ID", threadId)
      async function waitForRun(run: Run) {
        // Poll for status change
        console.log(new Date(),run.status, "Run in progress or queued: Current Status", run.status)
        run = await queuedOrInprogressRun(run, threads, threadId)
        console.log(new Date(),run.status, "Run in progress or queue completed: Current Status", run.status)
        
        run = await actionHandler(run, threads, threadId)
        
        run = await queuedOrInprogressRun(run, threads, threadId)
        console.log(new Date(),run.status, "Run in progress or queue completed: Current Status", run.status)

        // Check the run status
        if (
          run.status === "cancelled" ||
          run.status === "cancelling" ||
          run.status === "failed" ||
          run.status === "expired"
        ) {
          throw new Error(run.status);
        }

        while(run.status !== 'completed') {
          await new Promise((resolve) => {
            setTimeout(()=> {
                console.log(new Date(),run.status, "Run in progress 2 ...", run.status)
                resolve(true)
              }, 2000);
          })
          console.log(new Date(),run.status, "Run not completed: Current Status", run.status)
          run = await threads.runs.retrieve(threadId!, run.id);
        }
        console.log(new Date(),run.status, "Run Completed")
      }
      console.log(new Date(),run.status, "Waiting for run")
      await waitForRun(run);

      // Get new thread messages (after our message)
      console.log(new Date(),run.status, "Get new thread messages")
      await assistantResponse(threads, threadId, createdMessage, sendMessage)
    }
  );
}
