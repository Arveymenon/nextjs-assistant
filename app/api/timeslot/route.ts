import availableTimeSlotDatabase from "@/lib/hooks/availableTimeSlotDatabase";
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
    debugger;
    try {
        const body = await req.json();
        let startDateTime = body.schedule_start_datetime;
        let endDateTime = body.schedule_end_datetime;

        let response;
        if(body.type == 'get-slot')
            response = await availableTimeSlotDatabase.getTimeSlot()
        if(body.type == 'add-slot')
            response = await availableTimeSlotDatabase.addTimeSlot(startDateTime, endDateTime)

        return NextResponse.json(response);
    } catch(e) {
        console.error("Error processing timeslot:", e);
        return NextResponse.error();
    }
}

export async function DELETE(req: Request, response: Response) {
    console.log(new Date(), "timeslot DELETE api called")
    try {
        const body = await req.json();
        let id = body.id;

        let response;
            response = await availableTimeSlotDatabase.removeTimeSlot(id)

        return NextResponse.json(response);
    } catch(e) {
        console.error("Error processing timeslot:", e);
        return NextResponse.error();
    }
}