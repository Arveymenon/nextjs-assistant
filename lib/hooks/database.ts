import { db, sql } from "@vercel/postgres";

export enum ScheduleType {
    'set' = 'set', 
    'update' = 'update', 
    'delete' = 'delete'
}

export type Patient = {
    name: string,
    contact: string,
    schedule_start_datetime: string,
    schedule_end_datetime: string,
    schedule_type: ScheduleType
}

const Database = () => {
    // 1. Create entry
    // 1. Check if slot is already taken
    const set = async (patient: Patient) => {
        debugger;
        let res = await overlapExists(patient.schedule_start_datetime, patient.schedule_end_datetime)
        console.log(new Date(), "overlapExists", res)
        let response;
        if(!res) {
            await createEntry(patient)
            console.log(new Date(), "createEntry", "success")
            response = {success: true}
        } else {
            let schedule = await daySchedule(patient)
            console.log(new Date(), "schedule", schedule)
            response = {success: false, schedule}
        }
        return response;
    }
    const update = async (patient: Patient) => {
        let res = await overlapExists(patient.schedule_start_datetime, patient.schedule_end_datetime)
        if(!res) {
            await deleteEntry(patient.name)
            await createEntry(patient)
            return {success: true}
        } else {
            let schedule = await daySchedule(patient)
            return {success: false, schedule}
        }
    }
    
    const del = async (patient: Patient) => {
        await deleteEntry(patient.name)
        return {success: true}
    }

    const overlapExists = async (new_startdatetime: string, new_enddatetime: string) => {
        try {
            const row = await sql`
            SELECT *
            FROM schedule
            WHERE
                (
                    (startdatetime <= ${new_startdatetime} AND ${new_startdatetime} < enddatetime)
                    OR
                    (startdatetime < ${new_enddatetime} AND ${new_enddatetime} <= enddatetime)
                )
                OR
                (
                    (${new_startdatetime} <= startdatetime AND startdatetime < ${new_enddatetime})
                    OR
                    (${new_startdatetime} < enddatetime AND enddatetime <= ${new_enddatetime})
                )`;

            return row.rowCount ? true : false;
        } catch (e) {errorHandler}
        
    }

    const createEntry = async (patient: Patient) => {
        try {
            await sql`
                INSERT INTO 
                schedule (name, contact_number, startdatetime, enddatetime)
                VALUES (${patient.name}, ${patient.contact}, ${patient.schedule_start_datetime}, ${patient.schedule_end_datetime})
                RETURNING *;`
            return true;
        } catch (e) {errorHandler}
    }

    const deleteEntry = async (patientName: string) => {
        try {
            await sql`
                DELETE 
                FROM schedule 
                WHERE name = ${patientName};`;
            return true;
        } catch (e) {errorHandler}

    }

    const daySchedule = async (patient: Patient) => {
        const startDate = new Date("2023-09-28T00:00:00").toLocaleDateString();
        try {
            let {rows} = await sql`
                SELECT * 
                FROM schedule 
                WHERE DATE(startdatetime) = '${startDate}';`
    
            return rows
        } catch (e) {errorHandler}
    }

    return {set, update, del}

}

const errorHandler = (err: any) => {
    console.error(err)
    throw new Error(err)
}

export default Database()