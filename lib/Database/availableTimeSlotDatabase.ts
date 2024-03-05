import { sql } from "@vercel/postgres"


let availableTimeSlotDB = () => {

    let addTimeSlot = async (startTime: string, endtime: string) => {
        ;
        try {
            const { rows } = await sql`INSERT INTO timeslot (startdatetime, enddatetime)
            VALUES (${startTime}, ${endtime})
            RETURNING *;`
            return rows;
        } catch (e) {errorHandler}
    }

    let removeTimeSlot = async (id: string) => {
        let slot_id = parseInt(id);
        ;
        try {
            const { rows } = await sql`DELETE FROM timeslot
            WHERE id = ${slot_id};`
            return rows;
        } catch (e) {errorHandler}
    }

    let getTimeSlot = async () => {
        try {
            const { rows } = await sql`SELECT id, startdatetime, enddatetime
            FROM timeslot`

            return rows;
        } catch (e) {errorHandler}
    }

    return {addTimeSlot, removeTimeSlot, getTimeSlot}
}

const errorHandler = (err: any) => {
    console.error(err)
    throw new Error(err)
}

export default availableTimeSlotDB()