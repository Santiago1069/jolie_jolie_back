"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.query = exports.connect = void 0;
const oracledb = __importStar(require("oracledb"));
const config_1 = require("./config");
const connectionConfig = {
    user: config_1.DATABASE_USER,
    password: config_1.DATABASE_PASSWORD,
    connectString: config_1.DATABASE_CONNECT
};
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            connection = yield oracledb.getConnection(connectionConfig);
            console.log('Conectado a Oracle Database');
            return connection;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
exports.connect = connect;
function query(queryString, binds = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield connect();
        if (!connection) {
            return null;
        }
        let result;
        try {
            console.log(binds, "--bins------------------------------------");
            result = yield connection.execute(queryString, binds);
            yield connection.commit();
            console.log('Consulta ejecutada correctamente');
        }
        catch (error) {
            yield connection.rollback();
            console.error('ocurrio un error ejecutando la consulta \n' +
                queryString + '\n' +
                error);
            return null;
        }
        finally {
            try {
                yield connection.close();
                console.log('Desconectado de Oracle Database');
            }
            catch (error) {
                console.error(error);
            }
        }
        return result.rows;
    });
}
exports.query = query;
