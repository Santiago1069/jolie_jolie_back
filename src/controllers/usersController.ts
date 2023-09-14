import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { transporter } from './configEmail';
import jwt from 'jsonwebtoken';
require('dotenv').config();


import { query } from '../dataBaseConfig';
import { User } from '../models/user';
import { Profile } from '../models/profile';
import { TipeDocuments } from '../models/tipeDocuments';



class UsersController {

    public async all_users(req: Request, res: Response) {

        const users = await query('SELECT USUARIOS.IDENTIFICACION, USUARIOS.NOMBRE, USUARIOS.CORREO, USUARIOS.CELULAR, PERFILES.DESCRIPCION_PERFILES FROM USUARIOS INNER JOIN PERFILES ON USUARIOS.ID_PERFILES_FK = PERFILES.ID_PERFILES');

        if (users == null || users.length == 0) {
            res.json([]);
        } else {
            const map_user = users.map((p) => {
                let user: any = {
                    identificacion: p[0],
                    nombre: p[1],
                    correo: p[2],
                    celular: p[3],
                    perfil: p[4],
                    id_tipo_documento_fk: p[6]
                }
                return user
            });

            res.json(map_user)
        }
    }



    public async getOneUser(req: Request, res: Response): Promise<void> {

        const { id } = req.params;

        const select_one_user = await query('SELECT * FROM USUARIOS WHERE IDENTIFICACION = :0', [id]);

        if (select_one_user == null || select_one_user.length === 0 || select_one_user == undefined) {
            res.status(400).json({
                msg: `El usuario NO existe en la base de datos`
            });
        } else {
            let user: User = {
                identificacion: select_one_user![0][0],
                nombre: select_one_user![0][1],
                correo: select_one_user![0][2],
                password: select_one_user![0][3],
                celular: select_one_user![0][4],
                id_perfiles_fk: select_one_user![0][5],
                id_tipo_documento_fk: select_one_user![0][6]
            }
            res.json(user)
        }
    }



    public async createUser(req: Request, res: Response) {

        const { password } = req.body
        const password_encriptada = await bcrypt.hash(password, 10)

        const user_no_existe = await query('SELECT * FROM USUARIOS WHERE IDENTIFICACION = :0 AND CORREO = :1', [req.body.identificacion, req.body.correo]);

        if (user_no_existe == null || user_no_existe.length == 0) {
            const new_user = await query('INSERT INTO USUARIOS (IDENTIFICACION, NOMBRE, CORREO, PASSWORD, CELULAR, ID_PERFILES_FK, ID_TIPO_DOCUMENTO_FK) VALUES (:0, :1, :2, :3, :4, :5, :6)', [req.body.identificacion, req.body.nombre, req.body.correo, password_encriptada, req.body.celular, req.body.id_perfiles_fk, req.body.id_tipo_documento_fk]);

            res.json({
                msg: `Usuario ${req.body.nombre} creado exitosamente`,
                body: req.body
            })
        } else {
            res.status(400).json({
                msg: `El usuario con la identificacion '${req.body.identificacion}' ya existe en nuestra base de datos`,
            });

        }
    }



    public async deleteUser(req: Request, res: Response) {

        const { id } = req.params;
        const delete_user = await query('DELETE FROM USUARIOS WHERE IDENTIFICACION = :0', [id]);

        console.log('delete_user: ');
        console.log(delete_user);

        res.json({ text: 'elimino el usuario con la identificacion ' + id });
    }



    public async updateUser(req: Request, res: Response) {

        const { id } = req.params;


        const update_user = await query('UPDATE USUARIOS SET IDENTIFICACION = :0, NOMBRE = :1, CORREO = :2, CELULAR = :3, ID_PERFILES_FK = :4, ID_TIPO_DOCUMENTO_FK = :5 WHERE IDENTIFICACION = :6', [req.body.identificacion, req.body.nombre, req.body.correo, req.body.celular, req.body.id_perfiles_fk, req.body.id_tipo_documento_fk, id]);

        res.json({
            msg: `Usuario ${req.body.nombre} actualizado exitosamente`,
            body: req.body
        })
    }



    public async getProfiles(req: Request, res: Response) {

        const profiles = await query('SELECT * FROM PERFILES');

        if (profiles == null || profiles.length == 0) {
            res.json([]);
        } else {
            const map_profiles = profiles.map((p) => {
                let profile: Profile = {
                    id_perfiles: p[0],
                    descripcion_perfiles: p[1]
                }
                return profile
            });

            res.json(map_profiles)
        }
    }




    public async getTipeDocument(req: Request, res: Response) {

        const documents = await query('SELECT * FROM TIPO_DOCUMENTOS');

        if (documents == null || documents.length == 0) {
            res.json([]);
        } else {
            const map_documents = documents.map((p) => {
                let document: TipeDocuments = {
                    id_tipo_documento: p[0],
                    descripcion_tipo_documento: p[1]
                }
                return document
            });

            res.json(map_documents)
        }
    }

    public async validateEmail(req: Request, res: Response) {

        const { correo } = req.body;


        const user_existe = await query('SELECT * FROM USUARIOS WHERE CORREO = :0', [correo]);

        if (user_existe == null || user_existe.length === 0) {
            res.status(400).json({
                msg: `El usuario NO existe en la base de datos`
            });
            return
        } else {
            res.status(200).json({
                msg: `El usuario existe en la base de datos`
            });

            const uuid_password = uuidv4()
            const password_encriptada = await bcrypt.hash(uuid_password, 10)
            const update_new_password = await query('UPDATE USUARIOS SET PASSWORD = :0 WHERE CORREO = :1', [password_encriptada, correo])



            let info = await transporter.sendMail({
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
    }

    public async cambiarPassword(req: Request, res: Response) {

        const { password_actual, password_nueva } = req.body;

        const header_token = req.headers['authorization']
        const token = header_token!.slice(7);

        const secret_key1 = process.env.TOKEN_SECRET_KEY1;
        const secret_key2 = process.env.TOKEN_SECRET_KEY2;

        if (!secret_key1 || !secret_key2) {
            console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
            process.exit(1);
        }

        const payload = jwt.verify(token, secret_key1 || secret_key2) as { [key: string]: any };

        const user_db = await query('SELECT * FROM USUARIOS WHERE CORREO = :0', [payload.correo]);

        let user: User = {
            identificacion: user_db![0][0],
            nombre: user_db![0][1],
            correo: user_db![0][2],
            password: user_db![0][3],
            celular: user_db![0][4],
            id_perfiles_fk: user_db![0][5],
            id_tipo_documento_fk: user_db![0][6]
        }

        const validar_password = await bcrypt.compare(password_actual, user_db![0][3])

        if (!validar_password) {
            return res.status(400).json({
                msg: `Contraseña actual incorrecta`
            });
        }

        const password_encriptada = await bcrypt.hash(password_nueva, 10)
        const update_new_password = await query('UPDATE USUARIOS SET PASSWORD = :0 WHERE CORREO = :1', [password_encriptada, payload.correo])

        res.json(user);
    }


}

export const usersController = new UsersController();