require('dotenv').config;

export const DATABASE_USER=process.env.DATABASE_USER || 'JOLIE_JOLIE'
export const DATABASE_PASSWORD=process.env.DATABASE_PASSWORD ||'JOLIE_JOLIE_PASSWORD'
export const DATABASE_CONNECT=process.env.DATABASE_CONNECT || 'localhost:1521/xe'

//mysql
export const DB_USER=process.env.DB_USER || 'root'
export const DB_PASSWORD=process.env.DB_PASSWORD || 'IUnsqoWUxvDdAzDWRiuLGKgYdNzHZDWS'
export const DB_HOST=process.env.DB_HOST || 'monorail.proxy.rlwy.net'
export const DB_NAME=process.env.DB_NAME || 'railway'
export const DB_PORT=process.env.DB_USER || 45572
