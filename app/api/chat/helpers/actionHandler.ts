import database, { Patient, ScheduleType } from "@/lib/hooks/database";
import { QueryResultRow } from "@vercel/postgres";
import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";

export type appointmentScheduler = Promise<{
    success: boolean;
    schedule?: undefined;
} | {
    success: boolean;
    schedule: QueryResultRow[];
}>

const actionHandler = async (run: Run, threads: OpenAI.Beta.Threads, threadId: string) => {
    if(run.status === 'requires_action'){
        const toolCall = run.required_action?.submit_tool_outputs?.tool_calls[0]
        console.log("Tool Call", toolCall)
        if(toolCall){
          console.log("Tool Call function", toolCall)
          const functionResponse = await appointment_scheduler(
            toolCall.function.arguments,
            run,
            threads,
            threadId
          );
          console.log(new Date(), "functionResponse", functionResponse)
          
          run = await threads.runs.retrieve(threadId!, run.id);

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
          run = await threads.runs.retrieve(threadId!, run.id);
          console.log("Post submitToolOutputs", output.status)
        }
    }
    return run;
}

async function appointment_scheduler(args: string, run: Run, threads: OpenAI.Beta.Threads, threadId: string) {
    const patient: Patient = JSON.parse(args)
    console.log(patient)
    patient.schedule_start_datetime = patient.schedule_start_datetime+'Z'
    patient.schedule_end_datetime = patient.schedule_end_datetime+'Z'
    debugger;

    console.log(new Date(), run.status, "schedule_type", patient.schedule_type)
    let response;
    switch (patient.schedule_type) {
      case(ScheduleType.set): {
        response = await database.set(patient)
      }
      case(ScheduleType.delete): {
        response = await database.del(patient)
      }
      case(ScheduleType.update): {
        response = await database.update(patient)
      }
    }
    console.log(new Date(), run.status, response)
    debugger;
    run = await threads.runs.retrieve(threadId!, run.id);
  
    return response;
  }

export default actionHandler