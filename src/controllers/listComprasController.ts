import { Request, Response } from 'express';
require('dotenv').config();
import { query } from '../dataBaseConfigMYSQL';
import { Compras } from '../models/compras';
import jwt from 'jsonwebtoken';
import { listProductsController } from './listProductsController';

class ListComprasController {

    public async compras(req: Request, res: Response) {
       let product= await listProductsController.allProductsVentas();
        const compras = await query('SELECT C.*, U.nombre AS NOMBRE_USUARIO FROM COMPRAS C INNER JOIN USUARIOS U ON C.ID_USUARIO_FK = U.IDENTIFICACION  where C.ESTADO_COMPRAS=1');
        if (compras == null || compras.length == 0) {
            res.json([]);
        } else{
            const map_compras = compras.map((p:any) => {
                var pro:any[]=[];
                product.map((prod:any)=>{
                        if(prod.id_compra==p['ID_COMPRA']){
                        pro.push(prod)
                    }
                })
                let compra : Compras = {
                    id_compra: p['ID_COMPRA'],
                    fecha: p['FECHA'],
                    direccion: p['DIRECCION'],
                    estado: p['ESTADO_COMPRAS'],
                    valor_total: p['VALOR_TOTAL'],
                    usuario:p['NOMBRE_USUARIO'],
                    metodopago: p['METODOPAGO'],
                    producto:pro
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

        const user_db = await query('SELECT IDENTIFICACION FROM USUARIOS WHERE CORREO = ?', [payload['correo']]);


        const compras = await query('SELECT CP.*, P.NOMBRE_PRODUCTO, P.IMAGEN, C.* FROM COMPRAS_PRODUCTOS CP INNER JOIN PRODUCTOS  P ON CP.ID_PRODUCTO_FK = P.ID_PRODUCTO INNER JOIN COMPRAS C ON CP.ID_COMPRA_FK = C.ID_COMPRA INNER JOIN USUARIOS  U ON C.ID_USUARIO_FK = U.IDENTIFICACION WHERE U.IDENTIFICACION= ?', [user_db![0]['IDENTIFICACION']]);
        if (compras == null || compras.length == 0 || user_db==null) {
            res.json([]);
        } else {
            const map_compras = compras.map((p) => {
                let compra: any = {
                    id_compras_productos: p['ID_COMPRAS_PRODUCTOS'],
                    id_compra: p['ID_COMPRA_FK'],
                    id_producto_fk: p['ID_PRODUCTO_FK'],
                    valor_unidad: p['VALOR_UNIDAD'],
                    valor_total: p['VALOR_TOTAL'],
                    nombre_producto: p['NOMBRE_PRODUCTO'],
                    imagen: p['IMAGEN'],
                    fecha: p['FECHA'],
                    direccion: p['DIRECCION'],
                    estado: p['ESTADO_COMPRAS'],
                    metodo_pago: p['METODOPAGO'],
                    identificacion: user_db[0]['IDENTIFICACION']
                }
                return compra
            });
            res.json(map_compras)
        }
    }
}
export const listComprasController = new ListComprasController();