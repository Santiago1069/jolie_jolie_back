import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();



class ValidateToken {

    public async validate(req: Request, res: Response, next: NextFunction) {

        const header_token = req.headers['authorization']

        if (header_token != undefined && header_token.startsWith('Bearer ')) {
            //tiene token
            try {
                const bearer_token = header_token!.slice(7);

                //estas dos variables deben de ir en el archivo .env
                const secret_key1 = process.env.TOKEN_SECRET_KEY1;
                const secret_key2 = process.env.TOKEN_SECRET_KEY2;

                if (!secret_key1 || !secret_key2) {
                    console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                    process.exit(1);
                }

                jwt.verify(bearer_token, secret_key1 || secret_key2)
                next()
            } catch (error) {
                res.status(401).json({
                    msg: 'token no valido'
                });
            }
        } else {
            res.status(401).json({
                msg: 'Acceso denegado'
            });
        }
    }
}

export const validateToken = new ValidateToken();