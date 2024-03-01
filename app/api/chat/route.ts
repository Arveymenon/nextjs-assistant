// app/api/assistant/route.ts
import { experimental_AssistantResponse } from "ai";
import OpenAI from "openai";
import { MessageContentText } from "openai/resources/beta/threads/messages/messages";
import { Run } from "openai/resources/beta/threads/runs/runs";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
// export const runtime = "edge";

export async function POST(req: Request) {
  // Parse the request body
  console.log("Request Initiated")
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();
  console.log("Input", input)

  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;
  console.log("Thread Id", threadId)

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });
  console.log("Created message to be sent", input.message)

  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ threadId, sendMessage }) => {
      // Run the assistant on the thread
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
      });
      console.log("run prepared. Thread ID", threadId)
      async function waitForRun(run: Run) {
        // Poll for status change
        console.log("Run in progress queued: Current Status", run.status)
        while (run.status === "queued" || run.status === "in_progress") {
          // delay for 500ms:
          console.log("Run in progress: Current Status", run.status)
          await new Promise((resolve) => {
            setTimeout(()=> {
                console.log("Run in progress...", run.status)
                resolve(true)
              }, 500);
          })
          
          run = await openai.beta.threads.runs.retrieve(threadId!, run.id);
        }

        if(run.status === 'requires_action'){
          const firstTool = run.required_action?.submit_tool_outputs?.tool_calls[0]
          console.log("Run in tools", 
            firstTool
          )
          if(firstTool && firstTool.function.arguments) {
            const args = JSON.parse(firstTool.function.arguments);
            const result = appointment_scheduler(args);

            const runOp = await openai.beta.threads.runs.submitToolOutputs(
              threadId,
              run.id,
              {
                tool_outputs: [
                  {
                    tool_call_id: firstTool.id,
                    output: JSON.stringify(result),
                  }
                ],
              }
            );
            console.log("submit_tool_outputs", run?.required_action?.submit_tool_outputs)
            console.log("type",run?.required_action?.type)
            console.log("Action was submitted")
          }
        }

        // Check the run status
        if (
          run.status === "cancelled" ||
          run.status === "cancelling" ||
          run.status === "failed" ||
          run.status === "expired"
        ) {
          throw new Error(run.status);
        }
      }
      console.log("Waiting for run")
      await waitForRun(run);
      
      // Get new thread messages (after our message)
      console.log("Get new thread messages")
      console.log(new Date())
      const responseMessages = (
        await openai.beta.threads.messages.list(threadId, {
          after: createdMessage.id,
          order: "asc",
        })
        ).data;
        
      console.log("Sending Response")
      console.log(new Date())
      // Send the messages
      for (const message of responseMessages) {
        console.log("------------------------ ResponseMessages ------------------------")
        console.log(message.content)
        sendMessage({
          id: message.id,
          role: "assistant",
          content: message.content.filter(
            (content) => content.type === "text"
          ) as Array<MessageContentText>,
        });
      }
    }
  );
}

function appointment_scheduler(args: []) {
  return {success: false}
}