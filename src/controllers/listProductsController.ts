import { Request, Response } from 'express';

import { query } from '../dataBaseConfig';
import { Product } from '../models/product'


class ListProductsController {

    public async all_products(req: Request, res: Response) {

        const products = await query('SELECT * FROM PRODUCTOS');

        if (products == null || products.length == 0) {
            res.json([]);
        } else{
            console.log(products)
            const map_products = products.map((p) => {
                let product : Product = {
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
        } else{
            console.log(products)
            const map_products = products.map((p) => {
                let product : Product = {
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

}

export const listProductsController = new ListProductsController();