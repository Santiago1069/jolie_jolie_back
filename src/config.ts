require('dotenv').config;

export const DATABASE_USER=process.env.DATABASE_USER || 'JOLIE_JOLIE'
export const DATABASE_PASSWORD=process.env.DATABASE_PASSWORD ||'JOLIE_JOLIE_PASSWORD'
export const DATABASE_CONNECT=process.env.DATABASE_CONNECT || 'localhost:1521/xe'