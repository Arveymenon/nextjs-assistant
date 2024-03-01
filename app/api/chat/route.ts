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
const threads = openai.beta.threads;

export async function POST(req: Request) {
  // Parse the request body
  console.log(new Date(), "Request Initiated")
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();
  console.log(new Date(), "Input", input)

  // Create a thread if needed
  const threadId = input.threadId ?? (await threads.create({})).id;
  console.log(new Date(), "Thread Id", threadId)

  // Add a message to the thread
  const createdMessage = await threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });
  console.log(new Date(), "Created message to be sent", input.message)

  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ threadId, sendMessage }) => {
      // Run the assistant on the thread
      const run = await threads.runs.create(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
      });
      console.log(new Date(), "run prepared. Thread ID", threadId)
      async function waitForRun(run: Run) {
        // Poll for status change
        console.log(new Date(), "Run in progress queued: Current Status", run.status)
        while (run.status === "queued" || run.status === "in_progress") {
          // delay for 500ms:
          console.log(new Date(), "Run in progress: Current Status", run.status)
          await new Promise((resolve) => {
            setTimeout(()=> {
                console.log(new Date(), "Run in progress...", run.status)
                resolve(true)
              }, 500);
          })
          
          // run = await threads.runs.retrieve(threadId!, run.id);
        }

        // only one function in this example, but you can have multiple
        // const availableFunctions = {
        //   appointment_scheduler: appointment_scheduler,
        // }; 

        if(run.status === 'requires_action'){
          const toolCall = run.required_action?.submit_tool_outputs?.tool_calls[0]
          console.log("Tool Call", toolCall)
          if(toolCall){
            console.log("Tool Call function", toolCall)
          //   for (const toolCall of toolCalls) {
            // const functionName = toolCall.function.name;
            const functionToCall = appointment_scheduler;
            const functionArgs = toolCall.function.arguments;
            const functionResponse = await functionToCall(
              functionArgs
            );
            console.log(new Date(), "functionResponse", functionResponse)
            // messages.push({
            //   tool_call_id: toolCall.id,
            //   role: "tool",
            //   name: functionName,
            //   content: functionResponse,
            // }); // extend conversation with function response
            let output = await threads.runs.submitToolOutputs(
              threadId,
              run.id,
              {
                tool_outputs: [
                  {
                    tool_call_id: toolCall.id,
                    output: JSON.stringify(functionResponse),
                  }
                ],
              }
            );
            console.log("Post submitToolOutputs", output.status)
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

        while(run.status !== 'completed') {
          await new Promise((resolve) => {
            setTimeout(()=> {
                console.log(new Date(), "Run in progress...", run.status)
                resolve(true)
              }, 2000);
          })
        }
      }
      console.log(new Date(), "Waiting for run")
      await waitForRun(run);
      
      // Get new thread messages (after our message)
      console.log(new Date(), "Get new thread messages")
      const responseMessages = (
        await threads.messages.list(threadId, {
          after: createdMessage.id,
          order: "asc",
        })
      ).data;
        
      console.log(new Date(), "Sending Response responseMessages", responseMessages)
      // Send the messages

      for (const message of responseMessages) {
        console.log(new Date(), "------------------------ ResponseMessages ------------------------")
        console.log(new Date(), message.content)
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

function appointment_scheduler(args: string) {
  return {success: false}
}