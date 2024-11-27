import 'dotenv/config.js'

export const PORT = process.env.NODE_DOCKER_PORT
export const DB_URL = process.env.DB_URL
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
export const JWT_ACCESS_TIME = process.env.JWT_ACCESS_TIME
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
export const JWT_REFRESH_TIME = process.env.JWT_REFRESH_TIME