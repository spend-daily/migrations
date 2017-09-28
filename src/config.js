const DB_NAME = process.env.DB_NAME || 'spend'
const DB_USERNAME = process.env.DB_USERNAME || 'postgres'
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_ADDRESS = process.env.DB_ADDRESS || 'localhost'
const DB_PORT = process.env.DB_PORT || 5432

const DB_ENDPOINT = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_ADDRESS}:${DB_PORT}/${DB_NAME}`

export { DB_ENDPOINT }
