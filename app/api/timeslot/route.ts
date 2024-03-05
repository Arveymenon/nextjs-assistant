import availableTimeSlotDatabase from "@/lib/Database/availableTimeSlotDatabase";
import { NextResponse } from "next/server";

// export async function POST(req: Request, response: Response) {
//     console.log(new Date(), "timeslot api called")
//     try {
//         return NextResponse.json({ success: true });
//     } catch(e) {
//         return NextResponse.error();
//     }
// }

export async function POST(req: Request, response: Response) {
    console.log(new Date(), "timeslot POST api called")
    try {
        let response;
        if(req) {
            const body = await req.json();

            if(body.type == 'add-slot') {
                let startDateTime = body.schedule_start_datetime;
                let endDateTime = body.schedule_end_datetime;
                response = await availableTimeSlotDatabase.addTimeSlot(startDateTime, endDateTime)
                return NextResponse.json(response);
            } 
            if(body.type == 'get-slot') {
                response = await availableTimeSlotDatabase.getTimeSlot()
                return NextResponse.json(response);
            }
        }

    } catch(e) {
        console.error("Error processing timeslot:", e);
        return NextResponse.error();
    }
}

export async function DELETE(req: Request, response: Response) {
    console.log(new Date(), "timeslot DELETE api called")
    try {
        ;
        console.log("Req",req)
        const body = await req.json();
        console.log(new Date(), "BODY", body)
        let id = body.id;

        let response = await availableTimeSlotDatabase.removeTimeSlot(id)

        return NextResponse.json(response);
    } catch(e) {
        console.error("Error processing timeslot:", e);
        return NextResponse.error();
    }
}