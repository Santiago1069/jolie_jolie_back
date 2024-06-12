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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const dataBaseConfigMYSQL_1 = require("../dataBaseConfigMYSQL");
class ContactController {
    createMensaje(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const header_token = req.headers['authorization'];
            const token = header_token.slice(7);
            const secret_key1 = process.env.TOKEN_SECRET_KEY1;
            const secret_key2 = process.env.TOKEN_SECRET_KEY2;
            if (!secret_key1 || !secret_key2) {
                console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                process.exit(1);
            }
            const payload = jsonwebtoken_1.default.verify(token, secret_key1 || secret_key2);
            const mensajeContactanos = yield (0, dataBaseConfigMYSQL_1.query)('INSERT INTO CONTACTANOS (ASUNTO, MENSAJE, USER_ID) VALUES (?, ?, ?)', [req.body.asunto, req.body.mensaje, payload.identificacion]);
            res.status(200).json({});
        });
    }
    getMensajes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const mensajes = yield (0, dataBaseConfigMYSQL_1.query)('SELECT  USUARIOS.NOMBRE, USUARIOS.CORREO, USUARIOS.CELULAR, CONTACTANOS.ASUNTO, CONTACTANOS.MENSAJE FROM USUARIOS INNER JOIN CONTACTANOS ON USUARIOS.IDENTIFICACION = CONTACTANOS.USER_ID');
            if (mensajes == null || mensajes.length == 0) {
                res.json([]);
            }
            else {
                const map_mensajes = mensajes.map((p) => {
                    let user = {
                        nombre: p['NOMBRE'],
                        correo: p['CORREO'],
                        celular: p['CELULAR'],
                        asunto: p['ASUNTO'],
                        mensaje: p['MENSAJE']
                    };
                    return user;
                });
                res.json(map_mensajes);
            }
        });
    }
}
exports.contactController = new ContactController();
