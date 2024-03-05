import { sql } from "@vercel/postgres"


let availableTimeSlotDB = () => {

    let addTimeSlot = async (startTime: string, endtime: string) => {
        debugger;
        try {
            const { rows } = await sql`INSERT INTO timeslot (startdatetime, enddatetime)
            VALUES (${startTime}, ${endtime})
            RETURNING *;`
            return rows;
        } catch (e) {errorHandler}
    }

    let removeTimeSlot = async (id: string) => {
        try {
            const { rows } = await sql`DELETE FROM timeslot
            WHERE id = ${id};
            RETURNING *;`
            return rows;
        } catch (e) {errorHandler}
    }

    let getTimeSlot = async () => {
        debugger;
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