"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_PORT = exports.DB_NAME = exports.DB_HOST = exports.DB_PASSWORD = exports.DB_USER = exports.DATABASE_CONNECT = exports.DATABASE_PASSWORD = exports.DATABASE_USER = void 0;
require('dotenv').config;
exports.DATABASE_USER = process.env.DATABASE_USER || 'JOLIE_JOLIE';
exports.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'JOLIE_JOLIE_PASSWORD';
exports.DATABASE_CONNECT = process.env.DATABASE_CONNECT || 'localhost:1521/xe';
//mysql
exports.DB_USER = process.env.DB_USER || 'root';
exports.DB_PASSWORD = process.env.DB_PASSWORD || 'IUnsqoWUxvDdAzDWRiuLGKgYdNzHZDWS';
exports.DB_HOST = process.env.DB_HOST || 'monorail.proxy.rlwy.net';
exports.DB_NAME = process.env.DB_NAME || 'railway';
exports.DB_PORT = process.env.DB_USER || 45572;
