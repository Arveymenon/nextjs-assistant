import { sql } from "@vercel/postgres";

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
        try {
            await createEntry(patient)
            console.log(new Date(), "createEntry", "success")
            return {success: true}
        } catch (e) {errorHandler}
    }
    const update = async (patient: Patient) => {
        try {
            await deleteEntry(patient.name)
            await createEntry(patient)
            return {success: true}
        } catch (e) {errorHandler}
    }
    
    const del = async (patient: Patient) => {
        try {
            await deleteEntry(patient.name)
            return {success: true}
        } catch (e) {errorHandler}
    }

    const createEntry = async (patient: Patient) => {
        ;
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

    return {set, update, del}

}

const errorHandler = (err: any) => {
    console.error(err)
    throw new Error(err)
}

export default Database()