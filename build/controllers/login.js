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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
require('dotenv').config();
const dataBaseConfigMYSQL_1 = require("../dataBaseConfigMYSQL");
class LoginController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = req.body;
            const password_encriptada = yield bcrypt_1.default.hash(password, 10);
            const user_no_existe = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM USUARIOS WHERE IDENTIFICACION = ? AND CORREO = ?', [req.body.identificacion, req.body.correo]);
            if (user_no_existe == null || user_no_existe.length == 0) {
                const new_user = yield (0, dataBaseConfigMYSQL_1.query)('INSERT INTO USUARIOS (IDENTIFICACION, NOMBRE, CORREO, PASSWORD, CELULAR, ID_PERFILES_FK, ID_TIPO_DOCUMENTO_FK) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.identificacion, req.body.nombre, req.body.correo, password_encriptada, req.body.celular, 2, 1]);
                res.json({
                    msg: `Usuario ${req.body.nombre} creado exitosamente`
                });
            }
            else {
                res.status(400).json({
                    msg: `El usuario con la identificacion '${req.body.identificacion}' ya existe en nuestra base de datos`,
                });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, password } = req.body;
            //Validamo si el usuario existe en la base de datos
            const user_existe = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM USUARIOS WHERE CORREO = ?', [correo]);
            if (user_existe[0]['IDENTIFICACION'] == undefined || user_existe.length < 1) {
                res.status(400).json({
                    msg: `El correo o la contraseña son incorrectas`
                });
                return;
            }
            // Validamos la contraseña
            const validar_password = yield bcrypt_1.default.compare(password, user_existe[0]['PASSWORD']);
            console.log(user_existe[0]['PASSWORD']);
            if (!validar_password) {
                return res.status(400).json({
                    msg: `El correo o la contraseña son incorrectas`
                });
            }
            const secret_key1 = "ZYElJo_60K$98b[y$dgr4EQ[l";
            const secret_key2 = "i0G^OV~oaHnWZw$wXNF}2hJ.P";
            try {
                if (!secret_key1 || !secret_key2) {
                    console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                    process.exit(1);
                }
                const token = jwt.sign({
                    correo: correo,
                    identificacion: user_existe[0]['IDENTIFICACION'],
                }, secret_key1 || secret_key1);
                res.json(token);
            }
            catch (error) {
                // Manejo de errores
                console.error(error);
            }
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const header_token = req.headers['authorization'];
            const token = header_token.slice(7);
            const secret_key1 = "ZYElJo_60K$98b[y$dgr4EQ[l";
            const secret_key2 = "i0G^OV~oaHnWZw$wXNF}2hJ.P";
            if (!secret_key1 || !secret_key2) {
                console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                process.exit(1);
            }
            const payload = jwt.verify(token, secret_key1 || secret_key2);
            const user_db = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM USUARIOS WHERE CORREO = ?', [payload.correo]);
            let user = {
                identificacion: user_db[0]['IDENTIFICACION'],
                nombre: user_db[0]['NOMBRE'],
                correo: user_db[0]['CORREO'],
                password: user_db[0]['PASSWORD'],
                celular: user_db[0]['CELULAR'],
                id_perfiles_fk: user_db[0]['ID_PERFILES_FK'],
                id_tipo_documento_fk: user_db[0]['ID_TIPO_DOCUMENTO_FK']
            };
            res.json(user);
            return user;
        });
    }
}
exports.loginController = new LoginController();
