import { Request, Response } from 'express';
import { query } from '../dataBaseConfigMYSQL';

import { Product } from '../models/product';
import { Categories } from '../models/categories';




class ManagementProductsController {

    public async getOneProduct(req: Request, res: Response): Promise<void> {

        const { id } = req.params;

        const select_one_product = await query('SELECT PRODUCTOS.ID_PRODUCTO, PRODUCTOS.NOMBRE_PRODUCTO, PRODUCTOS.COLOR, PRODUCTOS.PRECIO, PRODUCTOS.IMAGEN, PRODUCTOS.DESCRIPCION_PRODUCTO, PRODUCTOS.CANTIDAD, PRODUCTOS.ESTADO, PRODUCTOS.ID_CATEGORIA_FK, CATEGORIAS.DESCRIPCION_CATEGORIA FROM PRODUCTOS INNER JOIN CATEGORIAS ON PRODUCTOS.ID_CATEGORIA_FK = CATEGORIAS.ID_CATEGORIA  WHERE ID_PRODUCTO = ?', [id]);

        if (select_one_product == null || select_one_product.length === 0 || select_one_product == undefined) {
            res.status(400).json({
                msg: `no hay productos en la base de datos`
            });

        } else {

            let product: any = {
                id_producto: select_one_product[0]['ID_PRODUCTO'],
                nombre_producto: select_one_product[0]['NOMBRE_PRODUCTO'],
                color: select_one_product[0]['COLOR'],
                precio: select_one_product[0]['PRECIO'],
                imagen: select_one_product[0]['IMAGEN'],
                descripcion_producto: select_one_product[0]['DESCRIPCION_PRODUCTO'],
                cantidad: select_one_product[0]['CANTIDAD'],
                estado: select_one_product[0]['ESTADO_PRODUCTO'],
                id_categoria: select_one_product[0]['ID_CATEGORIA_FK'],
                descripcion_categoria: select_one_product[0]['DESCRIPCION_CATEGORIA']
            }

            res.json(product)
        }



    }


    public async createProduct(req: Request, res: Response) {

        const create_one_product = await query('INSERT INTO PRODUCTOS ( nombre_producto, color, precio, imagen, descripcion_producto, cantidad, estado, id_categoria_fk) VALUES (?,?,?,?,?,?,?,?) ', [req.body.nombre_producto, req.body.color, req.body.precio, req.body.imagen, req.body.descripcion_producto, req.body.cantidad, req.body.estado, req.body.id_categoria]);



        res.json({
            nombre_producto: req.body.nombre_producto,
            color: req.body.color,
            precio: req.body.precio,
            imagen: req.body.imagen,
            descripcion_producto: req.body.descripcion_producto,
            cantidad: req.body.cantidad,
            estado: req.body.estado,
            id_categoria: req.body.id_categoria
        });
    }




    public async deleteProduct(req: Request, res: Response) {

        const { id } = req.params;
        const delete_product = await query('DELETE FROM PRODUCTOS WHERE ID_PRODUCTO = ?', [id]);

        res.json({ text: 'elimino el producto con el id #' + id });
    }




    public async updateProduct(req: Request, res: Response) {

        const { id } = req.params;

        const update_product = await query('UPDATE PRODUCTOS SET nombre_producto = ?, color = ?, precio = ?, imagen = ?, descripcion_producto = ?, cantidad = ?, estado = ?, id_categoria_fk = ? WHERE ID_PRODUCTO = ?', [req.body.nombre_producto, req.body.color, req.body.precio, req.body.imagen, req.body.descripcion_producto, req.body.cantidad, req.body.estado, req.body.id_categoria, id]);


        res.json({
            nombre_producto: req.body.nombre_producto,
            color: req.body.color,
            precio: req.body.precio,
            imagen: req.body.imagen,
            descripcion_producto: req.body.descripcion_producto,
            cantidad: req.body.cantidad,
            estado: req.body.estado,
            id_categoria: req.body.id_categoria
        });
    }



    public async getCategories(req: Request, res: Response){

        const categories = await query('SELECT * FROM CATEGORIAS');

        if (categories == null || categories.length == 0) {
            res.json([]);
        } else {
            const map_categories = categories.map((p) => {
                let categorie: Categories = {
                    id_categoria: p['ID_CATEGORIA_FK'],
                    categoria_descripcion: p['DESCRIPCION_CATEGORIA']
                }
                return categorie
            });

            res.json(map_categories)
        }
    }

}

export const managementProductsController = new ManagementProductsController();