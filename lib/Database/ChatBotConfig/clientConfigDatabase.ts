import { sql } from '@vercel/postgres'
import errorHandler from '../dbErrorHandler'

export type ClientConfig = {
  client: string
  welcomeText?: {
    text?: string
    subText?: string
  }
  icon?: {
    client?: string | File
    bot?: string | File
  }
  logo?: {
    client?: string | File
    customer?: string | File
  }
  favicon?: string | File
  title?: string
  theme?: string
}

const create = async (clientConfig: ClientConfig) => {
  console.log('clientConfig create')
  let query = ''
  try {
    console.log('clientConfig create try', clientConfig)
    const { rows } = await sql.query(`
        INSERT INTO client_config (
            client_id, welcome_text, welcome_subtext, icon_client, icon_bot, logo_client, logo_customer, favicon, title, theme
        ) VALUES (
            '${clientConfig.client.toString()}',
            '${clientConfig.welcomeText?.text || '.'}',
            '${clientConfig.welcomeText?.subText || '.'}',
            '${(clientConfig.icon?.client as string) || '.'}',
            '${(clientConfig.icon?.bot as string) || '.'}',
            '${(clientConfig.logo?.client as string) || '.'}',
            '${(clientConfig.logo?.customer as string) || '.'}',
            '${(clientConfig.favicon as string) || '.'}',
            '${clientConfig.title || '.'}',
            '${clientConfig.theme || '#000'}'
            )
            RETURNING *;
        `)
    console.log('Response: ', rows[0])
    return rows[0]
  } catch (e) {
    console.error(e)
    errorHandler(e)
  }
  console.log(query)
}

const read = async (clientConfigId: string) => {
  console.log('Get config clientConfigId', clientConfigId)
  try {
    console.log(
      'Get Query: ----- ',
      `SELECT * FROM client_config WHERE client_id = ${clientConfigId};`
    )
    const { rows } =
      await sql`SELECT * FROM client_config WHERE client_id = ${clientConfigId};`
    return rows[0]
  } catch (e) {
    errorHandler
  }
}

const update = async (clientConfig: ClientConfig) => {
  console.log('clientConfig update')
  try {
    const { rows } = await sql.query(`
        UPDATE client_config
            SET welcome_text = '${clientConfig.welcomeText?.text || '.'}',
                welcome_subtext = '${clientConfig.welcomeText?.subText || '.'}',
                icon_client = '${(clientConfig.icon?.client as string) || '.'}',
                icon_bot = '${(clientConfig.icon?.bot as string) || '.'}',
                logo_client = '${(clientConfig.logo?.client as string) || '.'}',
                logo_customer = '${(clientConfig.logo?.customer as string) || '.'}',
                favicon = '${(clientConfig.favicon as string) || '.'}',
                title = '${clientConfig.title || '.'}',
                theme = '${clientConfig.theme || '#000'}'
            WHERE client_id = '${clientConfig.client}'
            RETURNING *;`)
    console.log('Response: ', rows)
    return rows[0]
  } catch (e) {
    errorHandler
  }
}

const remove = async (clientConfigId: string) => {
  try {
    // `DELETE FROM client_config WHERE client_id = 1`
    const { rows } =
      await sql`DELETE FROM client_config WHERE client_id = ${clientConfigId};`
    return rows
  } catch (e) {
    errorHandler
  }
}

export default { create, read, update, remove }
