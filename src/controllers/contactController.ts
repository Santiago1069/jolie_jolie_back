import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();


import { query } from '../dataBaseConfig';



class ContactController {

    public async createMensaje(req: Request, res: Response) {

        const { asunto, mensaje } = req.body;

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

        const id_user = user_db![0][0];

        const mensajeContactanos = await query('INSERT INTO CONTACTANOS (ASUNTO, MENSAJE, USER_ID) VALUES (:0, :1, :2)', [req.body.asunto, req.body.mensaje, id_user]);

        res.status(200).json({});

    }


    public async getMensajes(req: Request, res: Response) {

        const mensajes = await query('SELECT  USUARIOS.NOMBRE, USUARIOS.CORREO, USUARIOS.CELULAR, CONTACTANOS.ASUNTO, CONTACTANOS.MENSAJE FROM USUARIOS INNER JOIN CONTACTANOS ON USUARIOS.IDENTIFICACION = CONTACTANOS.USER_ID');

        if (mensajes == null || mensajes.length == 0) {
            res.json([]);
        } else {
            const map_mensajes = mensajes.map((p) => {
                let user: any = {
                    nombre: p[0],
                    correo: p[1],
                    celular: p[2],
                    asunto: p[3],
                    mensaje: p[4]
                }
                return user
            });

            res.json(map_mensajes)
        }
    }
}

export const contactController = new ContactController();