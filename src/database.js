import knex from 'knex'
import path from 'path'

import { DB_ENDPOINT } from './config'

const db = knex({
  connection: DB_ENDPOINT,
  dialect: 'pg',
  migrations: {
    directory: path.join(__dirname, '/migrations'),
    tableName: 'knex_migrations'
  },
  multipleStatements: true
})

export default db
