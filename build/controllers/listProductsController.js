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
exports.listProductsController = void 0;
const dataBaseConfigMYSQL_1 = require("../dataBaseConfigMYSQL");
class ListProductsController {
    all_products(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM PRODUCTOS');
            if (products == null || products.length == 0) {
                res.json([]);
            }
            else {
                const map_products = products.map((p) => {
                    let product = {
                        id_producto: p['ID_PRODUCTO'],
                        nombre_producto: p['NOMBRE_PRODUCTO'],
                        color: p['COLOR'],
                        precio: p['PRECIO'],
                        imagen: p['IMAGEN'],
                        descripcion_producto: p['DESCRIPCION_PRODUCTO'],
                        cantidad: p['CANTIDAD'],
                        estado: p['ESTADO'],
                        id_categoria: p['ID_CATEGORIA_FK']
                    };
                    return product;
                });
                res.json(map_products);
            }
        });
    }
    allProductsActivate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const estado = 'Activo';
            const products = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM PRODUCTOS WHERE ESTADO = ?', [1]);
            if (products == null || products.length == 0) {
                res.json([]);
            }
            else {
                const map_products = products.map((p) => {
                    let product = {
                        id_producto: p['ID_PRODUCTO'],
                        nombre_producto: p['NOMBRE_PRODUCTO'],
                        color: p['COLOR'],
                        precio: p['PRECIO'],
                        imagen: p['IMAGEN'],
                        descripcion_producto: p['DESCRIPCION_PRODUCTO'],
                        cantidad: p['CANTIDAD'],
                        estado: p['ESTADO'],
                        id_categoria: p['ID_CATEGORIA_FK']
                    };
                    return product;
                });
                res.json(map_products);
            }
        });
    }
    productobyid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const select_one_producto = yield (0, dataBaseConfigMYSQL_1.query)('SELECT * FROM PRODUCTOS WHERE ID_PRODUCTO = ?', [id]);
            if (select_one_producto == null || select_one_producto.length === 0 || select_one_producto == undefined) {
                res.status(400).json({
                    msg: `El usuario NO existe en la base de datos`
                });
            }
            else {
                let product = {
                    id_producto: select_one_producto[0]['ID_PRODUCTO'],
                    nombre_producto: select_one_producto[0]['NOMBRE_PRODUCTO'],
                    color: select_one_producto[0]['COLOR'],
                    precio: select_one_producto[0]['PRECIO'],
                    imagen: select_one_producto[0]['IMAGEN'],
                    descripcion_producto: select_one_producto[0]['DESCRIPCION_PRODUCTO'],
                    cantidad: select_one_producto[0]['CANTIDAD'],
                    estado: select_one_producto[0]['ESTADO'],
                    id_categoria: select_one_producto[0]['ID_CATEGORIA_FK']
                };
                res.json(product);
            }
        });
    }
    allProductscard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { identificacion } = req.body;
            const carrito = yield this.allProductsCardfunsion(identificacion);
        });
    }
    allProductsVentas() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield (0, dataBaseConfigMYSQL_1.query)("SELECT CP.ID_COMPRA_FK,P.*,CP.cantidad AS CANTIDAD_VENDIDA,CP.valor_unidad AS VALOR_UNIDAD FROM COMPRAS_PRODUCTOS CP INNER JOIN PRODUCTOS P ON CP.ID_PRODUCTO_FK = P.ID_PRODUCTO INNER JOIN COMPRAS C ON C.id_compra=CP.id_compra_fk  WHERE C.ESTADO_COMPRAS=1");
            if (products == null || products.length == 0) {
                return [];
            }
            else {
                const map_products = products.map((p) => {
                    let product = {
                        id_compra: p['ID_COMPRA_FK'],
                        id_producto: p['ID_PRODUCTO'],
                        nombre_producto: p['NOMBRE_PRODUCTO'],
                        color: p['COLOR'],
                        precio: p['VALOR_UNIDAD'],
                        imagen: p['IMAGEN'],
                        descripcion_producto: p['DESCRIPCION_PRODUCTO'],
                        cantidad: p['CANTIDAD_VENDIDA'],
                        estado: p['ESTADO'],
                        id_categoria: p['ID_CATEGORIA_FK']
                    };
                    return product;
                });
                return map_products;
            }
        });
    }
    allProductsCardfunsion(identificacion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.esperarDosSegundoAsync();
            const venta = yield (0, dataBaseConfigMYSQL_1.query)('SELECT ID_COMPRA FROM COMPRAS WHERE ID_USUARIO_FK = ? AND ESTADO_COMPRAS = ?', [identificacion, 0]);
            const products = yield (0, dataBaseConfigMYSQL_1.query)('SELECT P.*, C.CANTIDAD, C.VALOR_UNIDAD FROM COMPRAS_PRODUCTOS C INNER JOIN PRODUCTOS P ON C.ID_PRODUCTO_FK = P.ID_PRODUCTO WHERE C.ID_COMPRA_FK = ?', [venta[0]['ID_COMPRA']]);
            if (products == null || products.length == 0) {
                return [];
            }
            else {
                const map_products = products.map((p) => {
                    let product = {
                        id_producto: p['ID_PRODUCTO'],
                        nombre_producto: p['NOMBRE_PRODUCTO'],
                        color: p['COLOR'],
                        precio: p['PRECIO'],
                        imagen: p['IMAGEN'],
                        descripcion_producto: p['DESCRIPCION_PRODUCTO'],
                        cantidad: p['CANTIDAD'],
                        estado: p['ESTADO'],
                        id_categoria: p['ID_CATEGORIA_FK']
                    };
                    return product;
                });
                return map_products;
            }
        });
    }
    esperarDosSegundoAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        });
    }
}
exports.listProductsController = new ListProductsController();
