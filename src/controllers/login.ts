import { Request, Response, json } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

import { query } from '../dataBaseConfig';
import { User } from '../models/user';


class LoginController {


    public async createUser(req: Request, res: Response) {

        const { password } = req.body
        const password_encriptada = await bcrypt.hash(password, 10)

        const user_no_existe = await query('SELECT * FROM USUARIOS WHERE IDENTIFICACION = :0 AND CORREO = :1', [req.body.identificacion, req.body.correo]);

        if (user_no_existe == null || user_no_existe.length == 0) {

            const new_user = await query('INSERT INTO USUARIOS (IDENTIFICACION, NOMBRE, CORREO, PASSWORD, CELULAR, ID_PERFILES_FK, ID_TIPO_DOCUMENTO_FK) VALUES (:0, :1, :2, :3, :4, :5, :6)', [req.body.identificacion, req.body.nombre, req.body.correo, password_encriptada, req.body.celular, 2, req.body.id_tipo_documento_fk]);


            res.json({
                msg: `Usuario ${req.body.nombre} creado exitosamente`
            })

        } else {

            res.status(400).json({
                msg: `El usuario con la identificacion '${req.body.identificacion}' ya existe en nuestra base de datos`,
            });

        }
    }



    public async loginUser(req: Request, res: Response) {

        const { correo, password } = req.body;

        //Validamo si el usuario existe en la base de datos
        const user_existe = await query('SELECT * FROM USUARIOS WHERE CORREO = :0', [correo]);

        if (user_existe == null || user_existe.length === 0) {
            res.status(400).json({
                msg: `El correo o la contraseña son incorrectas`
            });

            return
        }


        // Validamos la contraseña
        const validar_password = await bcrypt.compare(password, user_existe![0][3])
        console.log('validar_password: ' + validar_password);

        if (!validar_password) {
            return res.status(400).json({
                msg: `El correo o la contraseña son incorrectas`
            });
        }

        const secret_key1 = "ZYElJo_60K$98b[y$dgr4EQ[l";
        const secret_key2 = "i0G^OV~oaHnWZw$wXNF}2hJ.P";


        try {
            if (!secret_key1|| !secret_key1) {
                console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                process.exit(1);
            }

            const token = jwt.sign({
                correo: correo
            }, secret_key1|| secret_key1)

            res.json(token);

        } catch (error) {
            // Manejo de errores
            console.error(error);
        }

    }


    public async profile(req: Request, res: Response) {

        const header_token = req.headers['authorization']
        const token = header_token!.slice(7);

        const secret_key1 = "ZYElJo_60K$98b[y$dgr4EQ[l";
        const secret_key2 = "i0G^OV~oaHnWZw$wXNF}2hJ.P";

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

        res.json(user);
        return user
    }
}



export const loginController = new LoginController();