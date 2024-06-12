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
exports.usersController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const configEmail_1 = require("./configEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const dataBaseConfigMYSQL_1 = require("../dataBaseConfigMYSQL");
class UsersController {
    all_users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield (0, dataBaseConfigMYSQL_1.query)('SELECT U.IDENTIFICACION, U.NOMBRE, U.CORREO, U.CELULAR, P.DESCRIPCION_PERFILES,U.id_tipo_documento_fk FROM USUARIOS U INNER JOIN PERFILES  P ON U.ID_PERFILES_FK = P.ID_PERFILES');
            if (users == null || users.length == 0) {
                res.json([]);
            }
            else {
                const map_user = users.map((p) => {
                    let user = {
                        identificacion: p['IDENTIFICACION'],
                        nombre: p['NOMBRE'],
                        correo: p['CORREO'],
                        celular: p['CELULAR'],
                        perfil: p['DESCRIPCION_PERFILES'],
                        id_tipo_documento_fk: p['id_tipo_documento_fk']
                    };
                    return user;
                });
                res.json(map_user);
            }
        });
    }
    getOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const select_one_user = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM USUARIOS WHERE IDENTIFICACION = ?', [id]);
            if (select_one_user == null || select_one_user.length === 0 || select_one_user == undefined) {
                res.status(400).json({
                    msg: `El usuario NO existe en la base de datos`
                });
            }
            else {
                let user = {
                    identificacion: select_one_user[0]['IDENTIFICACION'],
                    nombre: select_one_user[0]['NOMBRE'],
                    correo: select_one_user[0]['CORREO'],
                    celular: select_one_user[0]['CELULAR'],
                    id_perfiles_fk: select_one_user[0]['ID_PERFILES_FK'],
                    id_tipo_documento_fk: select_one_user[0]['ID_TIPO_DOCUMENTO_FK']
                };
                res.json(user);
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = req.body;
            const password_encriptada = yield bcrypt_1.default.hash(password, 10);
            const user_no_existe = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM USUARIOS WHERE IDENTIFICACION = ? AND CORREO = ?', [req.body.identificacion, req.body.correo]);
            if (user_no_existe == null || user_no_existe.length == 0) {
                const new_user = yield (0, dataBaseConfigMYSQL_1.query)('INSERT INTO USUARIOS (IDENTIFICACION, NOMBRE, CORREO, PASSWORD, CELULAR, ID_PERFILES_FK, ID_TIPO_DOCUMENTO_FK) VALUES (?,?,?,?,?,?,?)', [req.body.identificacion, req.body.nombre, req.body.correo, password_encriptada, req.body.celular, req.body.id_perfiles_fk, req.body.id_tipo_documento_fk]);
                res.json({
                    msg: `Usuario ${req.body.nombre} creado exitosamente`,
                    body: req.body
                });
            }
            else {
                res.status(400).json({
                    msg: `El usuario con la identificacion '${req.body.identificacion}' ya existe en nuestra base de datos`,
                });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const delete_user = yield (0, dataBaseConfigMYSQL_1.query)('DELETE FROM USUARIOS WHERE IDENTIFICACION = ?', [id]);
            res.json({ text: 'elimino el usuario con la identificacion ' + id });
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const update_user = yield (0, dataBaseConfigMYSQL_1.query)('UPDATE USUARIOS SET IDENTIFICACION = ?, NOMBRE = ?, CORREO = ?, CELULAR = ?, ID_PERFILES_FK = ?, ID_TIPO_DOCUMENTO_FK = ? WHERE IDENTIFICACION = ?', [req.body.identificacion, req.body.nombre, req.body.correo, req.body.celular, req.body.id_perfiles_fk, req.body.id_tipo_documento_fk, id]);
            res.json({
                msg: `Usuario ${req.body.nombre} actualizado exitosamente`,
                body: req.body
            });
        });
    }
    getProfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const profiles = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM PERFILES');
            if (profiles == null || profiles.length == 0) {
                res.json([]);
            }
            else {
                const map_profiles = profiles.map((p) => {
                    let profile = {
                        id_perfiles: p['ID_PERFILES'],
                        descripcion_perfiles: p['DESCRIPCION_PERFILES']
                    };
                    return profile;
                });
                res.json(map_profiles);
            }
        });
    }
    getTipeDocument(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM TIPO_DOCUMENTOS;');
            if (documents == null || documents.length == 0) {
                res.json([]);
            }
            else {
                const map_documents = documents.map((p) => {
                    let document = {
                        id_tipo_documento: p['ID_TIPO_DOCUMENTO'],
                        descripcion_tipo_documento: p['DESCRIPCION_TIPO_DOCUMENTO']
                    };
                    return document;
                });
                res.json(map_documents);
            }
        });
    }
    validateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo } = req.body;
            const user_existe = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM USUARIOS WHERE CORREO = ?', [correo]);
            if (user_existe == null || user_existe.length === 0) {
                res.status(400).json({
                    msg: `El usuario NO existe en la base de datos`
                });
                return;
            }
            else {
                res.status(200).json({
                    msg: `El usuario existe en la base de datos`
                });
                const uuid_password = (0, uuid_1.v4)();
                const password_encriptada = yield bcrypt_1.default.hash(uuid_password, 10);
                const update_new_password = yield (0, dataBaseConfigMYSQL_1.query)('UPDATE USUARIOS SET PASSWORD = ? WHERE CORREO = ?', [password_encriptada, correo]);
                let info = yield configEmail_1.transporter.sendMail({
                    from: '"Jolie Jolie 🛍️"',
                    to: correo,
                    subject: "Cambio de contraseña en la tienda JOLIE JOLIE 🔐",
                    html: '<h2>Cambio de Contraseña</h2>' +
                        '<p>Estimado usuario,</p>' +
                        '<p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta.</p>' +
                        '<p><strong>Tu nueva contraseña es:</strong> ' + uuid_password + ' </p>' +
                        '<p>Si desea personalizar tu contraseña, dar clic <a href="http://localhost:4200/loginUser"><strong>aqui</strong></a></p>' +
                        '<p>Inicias sesion con la nueva contraseña, te diriges en la parte superior donde se encuentra las opciones</p>' +
                        '<p>y le das clic en "cambiar contraseña", cuando le salga el mensaje de exitoso es que el cambio fue exitoso</p>' +
                        '<p>Muchas Gracias</p>' +
                        '<p><strong>El equipo de JOLIE JOLIE</strong></p>',
                });
            }
        });
    }
    cambiarPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password_actual, password_nueva } = req.body;
            const header_token = req.headers['authorization'];
            const token = header_token.slice(7);
            const secret_key1 = process.env.TOKEN_SECRET_KEY1;
            const secret_key2 = process.env.TOKEN_SECRET_KEY2;
            if (!secret_key1 || !secret_key2) {
                console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                process.exit(1);
            }
            const payload = jsonwebtoken_1.default.verify(token, secret_key1 || secret_key2);
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
            const validar_password = yield bcrypt_1.default.compare(password_actual, user_db[0]['PASSWORD']);
            if (!validar_password) {
                return res.status(400).json({
                    msg: `Contraseña actual incorrecta`
                });
            }
            const password_encriptada = yield bcrypt_1.default.hash(password_nueva, 10);
            const update_new_password = yield (0, dataBaseConfigMYSQL_1.query)('UPDATE USUARIOS SET PASSWORD = ? WHERE CORREO = ?', [password_encriptada, payload.correo]);
            res.json(user);
        });
    }
}
exports.usersController = new UsersController();
