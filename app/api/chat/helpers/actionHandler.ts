import availableTimeSlotDatabase from "@/lib/Database/availableTimeSlotDatabase";
import database, { Patient, ScheduleType } from "@/lib/Database/scheduletDatabase";
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
    while(run.status === 'requires_action'){
        // const toolCall = [0]
        const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls || []
        for(let toolCall of toolCalls){
          console.log("Tool Call", toolCall)
          let functionResponse;
          if (toolCall.function.name === "appointment_scheduler") {
            functionResponse = await appointment_scheduler(
              toolCall.function.arguments,
              run,
              threads,
              threadId
            );
          }
          if (toolCall.function.name === "available_slot") {
            functionResponse = await available_slot(
              toolCall.function.arguments,
              run,
              threads,
              threadId
            );
          }
          if (toolCall.function.name === "current_timestamp") {
            functionResponse = await new Promise((resolve)=> resolve(new Date()))
            run = await threads.runs.retrieve(threadId!, run.id);
          }
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
    debugger;
    console.log(patient)
    if(patient.schedule_type !== ScheduleType.delete) {
      patient.schedule_start_datetime = new Date(patient.schedule_start_datetime).toISOString()
      patient.schedule_end_datetime = new Date(patient.schedule_end_datetime).toISOString()
    }

    console.log(new Date(), run.status, "schedule_type", patient.schedule_type)
    let response;
    if(patient.schedule_type == ScheduleType.set) {
      response = await database.set(patient)
    }
    if(patient.schedule_type == ScheduleType.delete) {
      response = await database.del(patient)
    }
    if(patient.schedule_type == ScheduleType.update) {
      response = await database.update(patient)
    }

    console.log(new Date(), run.status, response)
    run = await threads.runs.retrieve(threadId!, run.id);
  
    return response;
  }

  async function available_slot(args: string, run: Run, threads: OpenAI.Beta.Threads, threadId: string){
    let response = await availableTimeSlotDatabase.getTimeSlot()
    run = await threads.runs.retrieve(threadId!, run.id);
    if(!response || response.length == 0){
      return {"error": "doctor is not free"}
    }
    return response;
  }

export default actionHandler