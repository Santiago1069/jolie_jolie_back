import { Request, Response, json } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();
import { query } from '../dataBaseConfigMYSQL';
import User from '../models/user';


class LoginController {


    public async createUser(req: Request, res: Response) {

        const { password } = req.body
        const password_encriptada = await bcrypt.hash(password, 10)

        const user_no_existe = await query('SELECT * FROM USUARIOS WHERE IDENTIFICACION = ? AND CORREO = ?',[req.body.identificacion,req.body.correo]);

        if (user_no_existe == null || user_no_existe.length == 0) {

            const new_user = await query('INSERT INTO USUARIOS (IDENTIFICACION, NOMBRE, CORREO, PASSWORD, CELULAR, ID_PERFILES_FK, ID_TIPO_DOCUMENTO_FK) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.identificacion, req.body.nombre, req.body.correo, password_encriptada, req.body.celular, 2, 1]);


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
        const user_existe:any = await query('SELECT * FROM USUARIOS WHERE CORREO = ?',[correo]);
        
        if (user_existe[0]['IDENTIFICACION'] == undefined || user_existe.length < 1) {
            res.status(400).json({
                msg: `El correo o la contraseña son incorrectas`
            });
            return
        }


        // Validamos la contraseña
        const validar_password = await bcrypt.compare(password, user_existe![0]['PASSWORD'])
        console.log( user_existe![0]['PASSWORD'])
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
                identificacion: user_existe![0]['IDENTIFICACION'],
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
        const user_db = await query('SELECT * FROM USUARIOS WHERE CORREO = ?',[payload.correo]);

        let user: User = {
            identificacion: user_db![0]['IDENTIFICACION'],
            nombre: user_db![0]['NOMBRE'],
            correo: user_db![0]['CORREO'],
            password: user_db![0]['PASSWORD'],
            celular: user_db![0]['CELULAR'],
            id_perfiles_fk: user_db![0]['ID_PERFILES_FK'],
            id_tipo_documento_fk: user_db![0]['ID_TIPO_DOCUMENTO_FK']
        }

        res.json(user);
        return user
    }
}



export const loginController = new LoginController();