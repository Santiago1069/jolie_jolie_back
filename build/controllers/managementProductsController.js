"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managementProductsController = void 0;
const dataBaseConfigMYSQL_1 = require("../dataBaseConfigMYSQL");
class ManagementProductsController {
    getOneProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const select_one_product = yield (0, dataBaseConfigMYSQL_1.query)('SELECT P.ID_PRODUCTO, P.NOMBRE_PRODUCTO, P.COLOR, P.PRECIO, P.IMAGEN, P.DESCRIPCION_PRODUCTO, P.CANTIDAD, P.ESTADO, P.ID_CATEGORIA_FK, C.DESCRIPCION_CATEGORIA FROM PRODUCTOS P INNER JOIN CATEGORIAS C ON P.ID_CATEGORIA_FK = C.ID_CATEGORIA  WHERE P.ID_PRODUCTO = ?', [id]);
            if (select_one_product == null || select_one_product.length === 0 || select_one_product == undefined) {
                res.status(400).json({
                    msg: `no hay productos en la base de datos`
                });
            }
            else {
                let product = {
                    id_producto: select_one_product[0]['ID_PRODUCTO'],
                    nombre_producto: select_one_product[0]['NOMBRE_PRODUCTO'],
                    color: select_one_product[0]['COLOR'],
                    precio: select_one_product[0]['PRECIO'],
                    imagen: select_one_product[0]['IMAGEN'],
                    descripcion_producto: select_one_product[0]['DESCRIPCION_PRODUCTO'],
                    cantidad: select_one_product[0]['CANTIDAD'],
                    estado: select_one_product[0]['ESTADO'],
                    id_categoria: select_one_product[0]['ID_CATEGORIA_FK'],
                    descripcion_categoria: select_one_product[0]['DESCRIPCION_CATEGORIA']
                };
                res.json(product);
            }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const create_one_product = yield (0, dataBaseConfigMYSQL_1.query)('INSERT INTO PRODUCTOS ( nombre_producto, color, precio, imagen, descripcion_producto, cantidad, estado, id_categoria_fk) VALUES (?,?,?,?,?,?,?,?) ', [req.body.nombre_producto, req.body.color, req.body.precio, req.body.imagen, req.body.descripcion_producto, req.body.cantidad, req.body.estado, req.body.id_categoria]);
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
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const delete_product = yield (0, dataBaseConfigMYSQL_1.query)('DELETE FROM PRODUCTOS WHERE ID_PRODUCTO = ?', [id]);
            res.json({ text: 'elimino el producto con el id #' + id });
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const update_product = yield (0, dataBaseConfigMYSQL_1.query)('UPDATE PRODUCTOS SET nombre_producto = ?, color = ?, precio = ?, imagen = ?, descripcion_producto = ?, cantidad = ?, estado = ?, id_categoria_fk = ? WHERE ID_PRODUCTO = ?', [req.body.nombre_producto, req.body.color, req.body.precio, req.body.imagen, req.body.descripcion_producto, req.body.cantidad, req.body.estado, req.body.id_categoria, id]);
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
        });
    }
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM CATEGORIAS');
            if (categories == null || categories.length == 0) {
                res.json([]);
            }
            else {
                const map_categories = categories.map((p) => {
                    let categorie = {
                        id_categoria: p['ID_CATEGORIA_FK'],
                        categoria_descripcion: p['DESCRIPCION_CATEGORIA']
                    };
                    return categorie;
                });
                res.json(map_categories);
            }
        });
    }
}
exports.managementProductsController = new ManagementProductsController();
