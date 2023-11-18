import { Request, Response } from 'express';
require('dotenv').config();

import { query } from '../dataBaseConfig';
import { Compras } from '../models/compras';
import * as jwt  from 'jsonwebtoken';
import { User } from '../models/user';


class ListComprasController {

    public async compras(req: Request, res: Response) {

        const compras = await query('SELECT C.*, U.NOMBRE AS NOMBRE_USUARIO, MP.DESCRIPCION_METODOPAGO AS DESCRIPCION_METODO_PAGO FROM COMPRAS C INNER JOIN USUARIOS U ON C.ID_USUARIO_FK = U.IDENTIFICACION INNER JOIN METODOS_PAGO MP ON C.ID_METODOPAGO_FK = MP.ID_METODOPAGO');

        if (compras == null || compras.length == 0) {
            res.json([]);
        } else{
            const map_compras = compras.map((p:any) => {
                let compra : Compras = {
                    id_compra: p[0],
                    fecha: p[1],
                    direccion: p[2],
                    estado: p[3],
                    valor_total: p[4],
                    cantidad_productos: p[5],
                    usuario: p[9],
                    metodopago: p[10]
                }
                return compra
            });

            res.json(map_compras)
        }
    }


    public async misCompras(req: Request, res: Response) {

        const header_token = req.headers['authorization']
        const token = header_token!.slice(7);

        const secret_key1 = process.env['TOKEN_SECRET_KEY1'];
        const secret_key2 = process.env['TOKEN_SECRET_KEY2'];

        if (!secret_key1 || !secret_key2) {
            console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
            process.exit(1);
        }
        const payload = jwt.verify(token, secret_key1 || secret_key2) as { [key: string]: any };

        const user_db = await query('SELECT * FROM USUARIOS WHERE CORREO = :0', [payload['correo']]);

        const compras = await query('SELECT C.*, U.NOMBRE AS NOMBRE_USUARIO, MP.DESCRIPCION_METODOPAGO AS DESCRIPCION_METODO_PAGO FROM COMPRAS C INNER JOIN USUARIOS U ON C.ID_USUARIO_FK = U.IDENTIFICACION  INNER JOIN METODOS_PAGO MP ON C.ID_METODOPAGO_FK = MP.ID_METODOPAGO WHERE ID_USUARIO_FK = :0', [user_db![0][0]]);


        if (compras == null || compras.length == 0) {
            res.json([]);
        } else{
            const map_compras = compras.map((p:any) => {
                let compra : Compras = {
                    id_compra: p[0],
                    fecha: p[1],
                    direccion: p[2],
                    estado: p[3],
                    valor_total: p[4],
                    cantidad_productos: p[5],
                    usuario: p[9],
                    metodopago: p[10]
                }
                return compra
            });

            res.json(map_compras)
        }
    }





}
export const listComprasController = new ListComprasController();