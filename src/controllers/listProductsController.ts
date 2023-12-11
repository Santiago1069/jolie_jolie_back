import { Request, Response } from 'express';

import { query } from '../dataBaseConfigMYSQL';
import { Product } from '../models/product'


class ListProductsController {

    public async all_products(req: Request, res: Response) {

        const products = await query('SELECT * FROM PRODUCTOS');

        if (products == null || products.length == 0) {
            res.json([]);
        } else {
            const map_products = products.map((p) => {
                let product: Product = {
                    id_producto: p['ID_PRODUCTO'],
                    nombre_producto: p['NOMBRE_PRODUCTO'],
                    color: p['COLOR'],
                    precio: p['PRECIO'],
                    imagen: p['IMAGEN'],
                    descripcion_producto: p['DESCRIPCION_PRODUCTO'],
                    cantidad: p['CANTIDAD'],
                    estado: p['ESTADO_PRODUCTO'],
                    id_categoria: p['ID_CATEGORIA_FK']
                }
                return product
            });

            res.json(map_products)
        }
    }


    public async allProductsActivate(req: Request, res: Response) {

        const products = await query('SELECT * FROM PRODUCTOS WHERE ESTADO_PRODUCTO = ?', [1]);

        if (products == null || products.length == 0) {
            res.json([]);
        } else {
            const map_products = products.map((p: any) => {
                let product: Product = {
                    id_producto: p['ID_PRODUCTO'],
                    nombre_producto: p['NOMBRE_PRODUCTO'],
                    color: p['COLOR'],
                    precio: p['PRECIO'],
                    imagen: p['IMAGEN'],
                    descripcion_producto: p['DESCRIPCION_PRODUCTO'],
                    cantidad: p['CANTIDAD'],
                    estado: p['ESTADO_PRODUCTO'],
                    id_categoria: p['ID_CATEGORIA_FK']
                }
                return product
            });

            res.json(map_products)
        }
    }
    public async productobyid(req: Request, res: Response) {

        const { id } = req.params;

        const select_one_producto = await query('SELECT * FROM PRODUCTOS WHERE ID_PRODUCTO = ?', [id]);

        if (select_one_producto == null || select_one_producto.length === 0 || select_one_producto == undefined) {
            res.status(400).json({
                msg: `El usuario NO existe en la base de datos`
            });
        } else {
            let product: Product = {
                id_producto: select_one_producto![0]['ID_PRODUCTO'],
                nombre_producto: select_one_producto![0]['NOMBRE_PRODUCTO'],
                color: select_one_producto![0]['COLOR'],
                precio: select_one_producto![0]['PRECIO'],
                imagen: select_one_producto![0]['IMAGEN'],
                descripcion_producto: select_one_producto![0]['DESCRIPCION_PRODUCTO'],
                cantidad: select_one_producto![0]['CANTIDAD'],
                estado: select_one_producto![0]['ESTADO_PRODUCTO'],
                id_categoria: select_one_producto![0]['ID_CATEGORIA_FK']
            }
            res.json(product)
        }
    }
    public async allProductscard(req: Request, res: Response) {
        const { identificacion } = req.body;
        const carrito = await this.allProductsCardfunsion(identificacion);
    }

    public async allProductsVentas() {
        const products = await query("SELECT CP.ID_COMPRA_FK,P.*,CP.cantidad AS CANTIDAD_VENDIDA,CP.valor_unidad AS VALOR_UNIDAD FROM COMPRAS_PRODUCTOS CP INNER JOIN PRODUCTOS P ON CP.ID_PRODUCTO_FK = P.ID_PRODUCTO INNER JOIN COMPRAS C ON C.id_compra=CP.id_compra_fk  WHERE C.ESTADO_COMPRAS=1");
        if (products == null || products.length == 0) {
            return []
        } else {
            const map_products = products.map((p: any) => {
                let product = {
                    id_compra: p['ID_COMPRA_FK'],
                    id_producto: p['ID_PRODUCTO'],
                    nombre_producto: p['NOMBRE_PRODUCTO'],
                    color: p['COLOR'],
                    precio: p['VALOR_UNIDAD'],
                    imagen: p['IMAGEN'],
                    descripcion_producto: p['DESCRIPCION_PRODUCTO'],
                    cantidad: p['CANTIDAD_VENDIDA'],
                    estado: p['ESTADO_PRODUCTO'],
                    id_categoria: p['ID_CATEGORIA_FK']
                }
                return product
            });
            return map_products;
        }

    }
    public async cantidaProdVend(req: Request, res: Response) {
        const {fechainicio}=req.body
        const {fechafin}=req.body
        console.log(req.body)
        var products;
        if(fechafin!='' && fechainicio!=''){
         products = await query("SELECT P.NOMBRE_PRODUCTO,SUM(CP.cantidad) AS CANTIDAD_VENDIDA FROM `COMPRAS_PRODUCTOS` CP inner join `COMPRAS` C on id_compra_fk=id_compra INNER join `PRODUCTOS` P on id_producto_fk=id_producto  WHERE C.`FECHA` BETWEEN ? AND ?  GROUP BY P.`NOMBRE_PRODUCTO` ORDER BY SUM(CP.`CANTIDAD`) DESC",[fechainicio,fechafin]);
        }else{
          products = await query("SELECT P.NOMBRE_PRODUCTO,SUM(CP.cantidad) AS CANTIDAD_VENDIDA FROM `COMPRAS_PRODUCTOS` CP inner join `COMPRAS` C on id_compra_fk=id_compra INNER join `PRODUCTOS` P on id_producto_fk=id_producto GROUP BY P.`NOMBRE_PRODUCTO` ORDER BY SUM(CP.`CANTIDAD`) DESC");
        }

        if (products == null || products.length == 0) {
            res.json([]);
        } else {
            const map_products = products.map((p) => {
                const producto={
                    'nombre':p['NOMBRE_PRODUCTO'],
                    'cantidad':p['CANTIDAD_VENDIDA']
                }
                return producto
            });

            res.json(map_products)
        }
    }

    public async allProductsCardfunsion(identificacion: String) {
        await this.esperarDosSegundoAsync();
        console.log('id',identificacion);
        const venta = await query('SELECT ID_COMPRA FROM COMPRAS WHERE ID_USUARIO_FK = ? AND ESTADO_COMPRAS = ?', [identificacion, 0]);
        const products = await query('SELECT P.*, C.CANTIDAD, C.VALOR_UNIDAD FROM COMPRAS_PRODUCTOS C INNER JOIN PRODUCTOS P ON C.ID_PRODUCTO_FK = P.ID_PRODUCTO WHERE C.ID_COMPRA_FK = ?', [venta![0]['ID_COMPRA']]);
        if (products == null || products.length == 0) {
            return []
        } else {
            const map_products = products.map((p) => {
                let product: Product = {
                    id_producto: p['ID_PRODUCTO'],
                    nombre_producto: p['NOMBRE_PRODUCTO'],
                    color: p['COLOR'],
                    precio: p['PRECIO'],
                    imagen: p['IMAGEN'],
                    descripcion_producto: p['DESCRIPCION_PRODUCTO'],
                    cantidad: p['CANTIDAD'],
                    estado: p['ESTADO_PRODUCTO'],
                    id_categoria: p['ID_CATEGORIA_FK']
                }
                return product
            });

        }
    }

    public async esperarDosSegundoAsync(): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

}

export const listProductsController = new ListProductsController();