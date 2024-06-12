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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listComprasController = void 0;
require('dotenv').config();
const dataBaseConfigMYSQL_1 = require("../dataBaseConfigMYSQL");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const listProductsController_1 = require("./listProductsController");
class ListComprasController {
    compras(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield listProductsController_1.listProductsController.allProductsVentas();
            const compras = yield (0, dataBaseConfigMYSQL_1.query)('SELECT C.*, U.nombre AS NOMBRE_USUARIO FROM COMPRAS C INNER JOIN USUARIOS U ON C.ID_USUARIO_FK = U.IDENTIFICACION  where C.ESTADO_COMPRAS=1');
            if (compras == null || compras.length == 0) {
                res.json([]);
            }
            else {
                const map_compras = compras.map((p) => {
                    var pro = [];
                    product.map((prod) => {
                        if (prod.id_compra == p['ID_COMPRA']) {
                            pro.push(prod);
                        }
                    });
                    let compra = {
                        id_compra: p['ID_COMPRA'],
                        fecha: p['FECHA'],
                        direccion: p['DIRECCION'],
                        estado: p['ESTADO_COMPRAS'],
                        valor_total: p['VALOR_TOTAL'],
                        usuario: p['NOMBRE_USUARIO'],
                        metodopago: p['METODOPAGO'],
                        producto: pro
                    };
                    return compra;
                });
                res.json(map_compras);
            }
        });
    }
    misCompras(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const header_token = req.headers['authorization'];
            const token = header_token.slice(7);
            const secret_key1 = process.env['TOKEN_SECRET_KEY1'];
            const secret_key2 = process.env['TOKEN_SECRET_KEY2'];
            if (!secret_key1 || !secret_key2) {
                console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                process.exit(1);
            }
            const payload = jsonwebtoken_1.default.verify(token, secret_key1 || secret_key2);
            const user_db = yield (0, dataBaseConfigMYSQL_1.query)('SELECT IDENTIFICACION FROM USUARIOS WHERE CORREO = ?', [payload['correo']]);
            const compras = yield (0, dataBaseConfigMYSQL_1.query)('SELECT CP.*, P.NOMBRE_PRODUCTO, P.IMAGEN, C.* FROM COMPRAS_PRODUCTOS CP INNER JOIN PRODUCTOS  P ON CP.ID_PRODUCTO_FK = P.ID_PRODUCTO INNER JOIN COMPRAS C ON CP.ID_COMPRA_FK = C.ID_COMPRA INNER JOIN USUARIOS  U ON C.ID_USUARIO_FK = U.IDENTIFICACION WHERE U.IDENTIFICACION= ?', [user_db[0]['IDENTIFICACION']]);
            if (compras == null || compras.length == 0 || user_db == null) {
                res.json([]);
            }
            else {
                const map_compras = compras.map((p) => {
                    let compra = {
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
                    };
                    return compra;
                });
                res.json(map_compras);
            }
        });
    }
}
exports.listComprasController = new ListComprasController();
