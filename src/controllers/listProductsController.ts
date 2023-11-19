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
            const map_products = products.map((p:any) => {
                console.log("--------------------------------------------------",p)
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
    public async productobyid(req: Request, res: Response) {

        const { id } = req.params;

        const select_one_producto = await query('SELECT * FROM USUARIOS WHERE IDENTIFICACION = :0', [id]);

        if (select_one_producto == null || select_one_producto.length === 0 || select_one_producto == undefined) {
            res.status(400).json({
                msg: `El usuario NO existe en la base de datos`
            });
        } else {
            let product : Product = {
                id_producto: select_one_producto![0][0],
                nombre_producto: select_one_producto![0][1],
                color: select_one_producto![0][2],
                precio: select_one_producto![0][3],
                imagen: select_one_producto![0][4],
                descripcion_producto: select_one_producto![0][5],
                cantidad: select_one_producto![0][6],
                estado: select_one_producto![0][7],
                id_categoria: select_one_producto![0][8]
            }
            res.json(product)
        }
    }
    public async allProductscard(req: Request, res: Response) {
        const {identificacion} = req.body;
        const carrito=await this.allProductsCardfunsion(identificacion);
            res.json(carrito)
    }
    public async allProductsCardfunsion(identificacion:String) {
        const venta = await query('select id_compra from compras where id_usuario_fk= :0 and estado=:1',[identificacion,0]);
        const products = await query('SELECT P.*,c.cantidad,c.valor_unidad FROM COMPRAS_PRODUCTOS C INNER JOIN PRODUCTOS P ON C.ID_PRODUCTO_FK = P.ID_PRODUCTO WHERE C.id_compra_fk = :0 ', [venta![0][0]]);
        if (products == null || products.length == 0) {
            return []
        } else{
            const map_products = products.map((p:any) => {
                let product : Product = {
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

    public async allProductsVentas() {
        const products = await query("SELECT cp.id_compra_fk,P.*,CP.cantidad,CP.valor_unidad FROM COMPRAS_PRODUCTOS CP INNER JOIN PRODUCTOS P ON CP.ID_PRODUCTO_FK = P.ID_PRODUCTO INNER JOIN COMPRAS C ON C.id_compra=CP.id_compra_fk  WHERE C.ESTADO=1");
        if (products == null || products.length == 0) {
            return []
        } else{
            const map_products = products.map((p:any) => {
                let product  = {
                    id_compra:p[0],
                    id_producto: p[1],
                    nombre_producto: p[2],
                    color: p[3],
                    precio: p[11],
                    imagen: p[5],
                    descripcion_producto: p[6],
                    cantidad: p[10],
                    estado: p[8],
                    id_categoria: p[9]
                }
                return product
            });
            return map_products;
        }

    }


}

export const listProductsController = new ListProductsController();