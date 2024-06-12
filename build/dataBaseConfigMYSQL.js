"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
const promise_1 = require("mysql2/promise");
const config_1 = require("./config");
exports.pool = (0, promise_1.createPool)({
    host: config_1.DB_HOST,
    user: config_1.DB_USER,
    password: config_1.DB_PASSWORD,
    database: config_1.DB_NAME,
    port: 45572
});
function query(queryString, binds = []) {
    return __awaiter(this, void 0, void 0, function* () {
        let connection = null;
        try {
            connection = yield exports.pool.getConnection();
            const [rows] = yield connection.query(queryString, binds);
            connection.commit();
            console.log('Consulta ejecutada correctamente');
            return rows;
        }
        catch (error) {
            if (connection) {
                yield connection.rollback();
            }
            console.error(`Ocurrió un error ejecutando la consulta: \n${queryString}\n${error}`);
            return null;
        }
        finally {
            if (connection) {
                try {
                    connection.release(); // Liberar la conexión al grupo de conexiones
                }
                catch (error) {
                    console.error('Error al liberar la conexión:', error);
                }
            }
        }
    });
}
exports.query = query;
