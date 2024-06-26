import { sql } from "@vercel/postgres"
import errorHandler from "../dbErrorHandler";

const create = async (customerName: string) => {
    try {
        const { rows } = await sql`INSERT INTO customers (name) VALUES (${customerName})`
        return rows;
    } catch (e) {errorHandler}
}

const read = async (customerId: string) => {
    try {
        const { rows } = await sql`SELECT * FROM customers WHERE id = ${customerId};`
        return rows;
    } catch (e) {errorHandler}
}

const update = async (customerName: string, customerId: string) => {
    try {
        const { rows } = await sql`UPDATE customers
        SET name = ${customerName}
        WHERE id = ${customerId};`
        return rows;
    } catch (e) {errorHandler}
}

const remove = async (customerId: string) => {
    try {
        const { rows } = await sql`DELETE FROM customers WHERE id = ${customerId};`
        return rows;
    } catch (e) {errorHandler}
}

export default { create, read, update, remove }