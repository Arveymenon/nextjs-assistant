import { sql } from "@vercel/postgres"
import errorHandler from "../dbErrorHandler";

export type Client = {
    id?: string
    name: string
    open_ai_key: string
    assistant_key: string
    customer_id: string
}

const create = async (client: Client) => {
    try {
        const { rows } = await sql`INSERT INTO clients (name, open_ai_key, assistant_key, customer_id)
        VALUES (${client.name}, ${client.open_ai_key}, ${client.assistant_key}, ${client.customer_id});`
        return rows;
    } catch (e) {errorHandler}
}

const read = async (clientId: string) => {
    try {
        const { rows } = await sql`SELECT * FROM clients WHERE id = ${clientId};`
        return rows;
    } catch (e) {errorHandler}
}

const update = async (client: Client) => {
    try {
        const { rows } = await sql`UPDATE clients
        SET name = ${client.name},
            open_ai_key = ${client.open_ai_key},
            assistant_key = ${client.assistant_key},
            customer_id = ${client.customer_id}
        WHERE id = ${client.id};`
        return rows;
    } catch (e) {errorHandler}
}

const remove = async (clientId: string) => {
    try {
        const { rows } = await sql`DELETE FROM clients WHERE id = ${clientId};`
        return rows;
    } catch (e) {errorHandler}
}

export default { create, read, update, remove }