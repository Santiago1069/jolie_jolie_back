import { Request, Response } from 'express';

import { query } from '../dataBaseConfig';
import { Product } from '../models/product'


class ListProductsController {

    public async all_products(req: Request, res: Response) {

        const products = await query('SELECT * FROM PRODUCTOS');

        if (products == null || products.length == 0) {
            res.json([]);
        } else {
            const map_products = products.map((p) => {
                let product: Product = {
                    id_producto: p[0],
                    nombre_producto: p[1],
                    color: p[2],
                    precio: p[3],
                    imagen: p[4],
                    descripcion_producto: p[5],
                    cantidad: p[6],
                    estado: p[7],
                    id_categoria: p[8]
                }
                return product
            });

            res.json(map_products)
        }
    }


    public async allProductsActivate(req: Request, res: Response) {

        const estado = 'Activo';

        const products = await query('SELECT * FROM PRODUCTOS WHERE ESTADO = :0', [estado]);

        if (products == null || products.length == 0) {
            res.json([]);
        } else {
            console.log(products)
            const map_products = products.map((p) => {
                let product: Product = {
                    id_producto: p[0],
                    nombre_producto: p[1],
                    color: p[2],
                    precio: p[3],
                    imagen: p[4],
                    descripcion_producto: p[5],
                    cantidad: p[6],
                    estado: p[7],
                    id_categoria: p[8]
                }
                return product
            });

            res.json(map_products)
        }
    }

    public async allProductsCardfunsion(identificacion: String) {
        const venta = await query('select id_compra from compras where id_usuario_fk= :0 and estado=:1', ['1212212121', 0]);
        const products = await query('SELECT P.*,c.cantidad,c.valor_unidad FROM COMPRAS_PRODUCTOS C INNER JOIN PRODUCTOS P ON C.ID_PRODUCTO_FK = P.ID_PRODUCTO WHERE C.id_compra_fk = :0 ', [venta![0][0]]);
        if (products == null || products.length == 0) {
            return []
        } else {
            const map_products = products.map((p) => {
                let product: Product = {
                    id_producto: p[0],
                    nombre_producto: p[1],
                    color: p[2],
                    precio: p[10],
                    imagen: p[4],
                    descripcion_producto: p[5],
                    cantidad: p[9],
                    estado: p[7],
                    id_categoria: p[8]
                }
                return product
            });
            return map_products;
        }
    }

}

export const listProductsController = new ListProductsController();