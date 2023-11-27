import { Request, Response } from 'express';
require('dotenv').config();

import { query } from '../dataBaseConfig';
import { Compras } from '../models/compras';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';


class ListComprasController {

    public async compras(req: Request, res: Response) {

        const compras = await query('SELECT C.*, U.NOMBRE AS NOMBRE_USUARIO, FROM COMPRAS C INNER JOIN USUARIOS U ON C.ID_USUARIO_FK = U.IDENTIFICACION');

        if (compras == null || compras.length == 0) {
            res.json([]);
        } else {
            const map_compras = compras.map((p) => {
                let compra: Compras = {
                    id_compra: p[0],
                    fecha: p[1],
                    direccion: p[2],
                    estado: p[3],
                    valor_total: p[4],
                    cantidad_productos: p[5],
                    metodo_pago: p[8],
                    usuario: p[9],
                }
                return compra
            });

            res.json(map_compras)
        }
    }


    public async misCompras(req: Request, res: Response) {

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

        const compras = await query('SELECT CP.*, P.NOMBRE_PRODUCTO, P.IMAGEN, C.*, U.IDENTIFICACION FROM COMPRAS_PRODUCTOS CP INNER JOIN PRODUCTOS  P ON CP.ID_PRODUCTO_FK = P.ID_PRODUCTO INNER JOIN COMPRAS  C ON CP.ID_COMPRA_FK = C.ID_COMPRA INNER JOIN USUARIOS  U ON C.ID_USUARIO_FK = U.IDENTIFICACION WHERE ID_USUARIO_FK = :0', [user_db![0][0]]);


        if (compras == null || compras.length == 0) {
            res.json([]);
        } else {
            const map_compras = compras.map((p) => {
                let compra: any = {
                    id_compras_productos: p[0],
                    id_compra: p[1],
                    id_producto_fk: p[2],
                    cantidad: p[3],
                    valor_unidad: p[4],
                    valor_total: p[5],
                    nombre_producto: p[6],
                    imagen: p[7],
                    fecha: p[9],
                    direccion: p[10],
                    estado: p[11],
                    metodo_pago: p[16],
                    identificacion: p[17],
                }
                return compra
            });
            res.json(map_compras)
        }
    }





}
export const listComprasController = new ListComprasController();