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
exports.paymentontroller = void 0;
const mercadopago = require("mercadopago");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configEmail_1 = require("./configEmail");
const uuidv4_1 = require("uuidv4");
const dataBaseConfigMYSQL_1 = require("../dataBaseConfigMYSQL");
const listProductsController_1 = require("./listProductsController");
class Paymentontroller {
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = Paymentontroller.getPayloadToken(req);
            console.log('payload!.identificacion');
            console.log(payload.identificacion);
            var carrito = yield listProductsController_1.listProductsController.allProductsCardfunsion(payload.identificacion);
            var item = [];
            if (!carrito) {
                console.error('El carrito es undefined.');
                res.status(500).send('Error interno del servidor');
                return;
            }
            else {
                for (let i = 0; i < carrito.length; i++) {
                    item.push({
                        title: carrito[i]['nombre_producto'],
                        unit_price: carrito[i]['precio'],
                        currency_id: "COP",
                        quantity: carrito[i]['cantidad'],
                        picture_url: carrito[i]['imagen']
                    });
                }
            }
            const mercadopagoAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
            if (!mercadopagoAccessToken) {
                console.error('La variable de entorno MERCADOPAGO_ACCESS_TOKEN no está definida.');
                process.exit(1);
            }
            mercadopago.configure({
                access_token: mercadopagoAccessToken
            });
            console.log('item');
            console.log(item);
            const result = yield mercadopago.preferences.create({
                items: item,
                back_urls: {
                    success: "http://localhost:4200/success",
                    failure: "http://localhost:4200/failure",
                    pending: "https://c3dnwtjj-4200.use2.devtunnels.ms/pending"
                },
                notification_url: "https://c3dnwtjj-4200.use2.devtunnels.ms/webhook",
                payer: {
                    email: payload.correo,
                    identification: {
                        type: "CC",
                        number: payload.identificacion
                    }
                },
            });
            res.send(result.body);
        });
    }
    getWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = req.query;
                if (payment && typeof payment === 'object' && payment.type === "payment") {
                    const dataId = payment["data.id"];
                    if (dataId) {
                        const numericDataId = parseInt(dataId, 10);
                        const data = yield mercadopago.payment.findById(numericDataId);
                        if (data.body.status === "approved") {
                            const createCompra = yield (0, dataBaseConfigMYSQL_1.query)(`UPDATE COMPRAS SET ESTADO_COMPRAS = ?, METODOPAGO = ? WHERE ID_USUARIO_FK = ?`, [1, data.body.payment_method.type, data.body.payer.identification.number]);
                            var html = "";
                            for (let i = 0; i < data.response.additional_info.items.length; i++) {
                                html += '<div class="card mb-3" style="max-width: 540px;">' +
                                    '<div class="row g-0">' +
                                    '<div class="col-md-4">' +
                                    '<img src="' + data.response.additional_info.items[i].picture_url + '" alt="imagen del producto" class="img-fluid rounded-start" width="146.17" height="146.17">' +
                                    '</div>' +
                                    '<div class="col-md-8">' +
                                    '<div class="card-body">' +
                                    '<h5 class="card-title">Nombre del producto: ' + data.response.additional_info.items[i].title + '</h5>' +
                                    '<p class="card-text"><strong>Cantidad: </strong>' + data.response.additional_info.items[i].quantity + '</p>' +
                                    '<p class="card-text"><strong>Precio: </strong>$' + data.response.additional_info.items[i].unit_price + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                            }
                            yield configEmail_1.transporter.sendMail({
                                from: '"Jolie Jolie 🛍️"',
                                to: /* data.body.payer.email */ 'santiago_sandoval23201@elpoli.edu.co',
                                subject: "Compra en la tienda JOLIE JOLIE 💰",
                                html: '<h2 class="display-4">Compra exitosa</h2>' +
                                    '<p class="lead">Estimado usuario,</p>' +
                                    '<p>Hemos recibido una solicitud de compra y el estado fue exitoso.</p>' +
                                    '<div class="mb-3">' + html + '</div>' +
                                    '<p class="lead">Muchas gracias por tu compra</p>' +
                                    '<p class="lead"><strong>El equipo de JOLIE JOLIE</strong></p>',
                            });
                        }
                    }
                    else {
                        console.error("El ID de pago es undefined.");
                    }
                }
                else {
                    console.error("La consulta no tiene el formato esperado.");
                }
                res.sendStatus(204);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Something goes wrong" });
            }
        });
    }
    successCompra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({
                msg: `La compra se ha realizado correctamente`
            });
        });
    }
    failureCompra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({
                msg: `La compra no se completo correctamente`
            });
        });
    }
    createCompra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id_compra = Paymentontroller.generarNuevoIdCompra();
            id_compra = id_compra.replace(/\./g, '');
            console.warn('id_compra');
            console.warn(id_compra);
            const fechaOriginal = new Date();
            const año = fechaOriginal.getFullYear();
            const mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, '0');
            const día = fechaOriginal.getDate().toString().padStart(2, '0');
            const fechaFormateada = `${año}-${mes}-${día}`;
            const createCompra = yield (0, dataBaseConfigMYSQL_1.query)('INSERT INTO COMPRAS (ID_COMPRA, FECHA, DIRECCION, ESTADO_COMPRAS, VALOR_TOTAL, CANTIDAD_PRODUCTOS, ID_USUARIO_FK, ID_ZONA_FK, ID_METODOPAGO_FK) VALUES (?,STR_TO_DATE(?,"%Y-%m-%d"), ?, ?, ?, ?, ?, ?, ?)', [id_compra, fechaFormateada, req.body.direccion, req.body.estado, req.body.valor_total, req.body.cantidad_productos, req.body.id_usuario_fk, req.body.id_zona_fk, req.body.metodopago]);
            res.json({
                id_compra: id_compra,
                fecha: fechaFormateada,
                direccion: req.body.direccion,
                estado: req.body.estado,
                valor_total: req.body.valor_total,
                cantidad_productos: req.body.cantidad_productos,
                id_usuario_fk: req.body.id_usuario_fk,
                id_zona_fk: req.body.id_zona_fk,
                metodopago: req.body.metodopago
            });
        });
    }
    createComprasProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_compra = req.params.id;
            for (let i = 0; i < req.body.length; i++) {
                let id_compra_productos = Math.floor(Math.random() * 2000000);
                let valor_total = req.body[i].quantityProducts * req.body[i].price;
                const createCompraProducts = yield (0, dataBaseConfigMYSQL_1.query)(`INSERT INTO COMPRAS_PRODUCTOS (ID_COMPRAS_PRODUCTOS, ID_COMPRA_FK, ID_PRODUCTO_FK, CANTIDAD, VALOR_UNIDAD, VALOR_TOTAL) VALUES (?, ?, ?, ?, ?, ?)`, [id_compra_productos, id_compra, req.body[i].id_producto, req.body[i].quantityProducts, req.body[i].price, valor_total]);
                id_compra_productos = 0;
            }
            res.json({
                msg: `La compra en total tiene ${req.body.length} productos`
            });
        });
    }
    static generarNuevoIdCompra() {
        const myUUID = (0, uuidv4_1.uuid)();
        let result = "";
        const uuidWithoutLetters = myUUID.replace(/\D/g, '');
        for (var i = 0; i < 9; i++) {
            result = result + uuidWithoutLetters[i];
        }
        return result;
    }
    static getPayloadToken(req) {
        const header_token = req.headers['authorization'];
        if (header_token != undefined && header_token.startsWith('Bearer ')) {
            const token = header_token.slice(7);
            const secret_key1 = process.env.TOKEN_SECRET_KEY1;
            const secret_key2 = process.env.TOKEN_SECRET_KEY2;
            if (!secret_key1 || !secret_key2) {
                console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                process.exit(1);
            }
            try {
                const payload = jsonwebtoken_1.default.verify(token, secret_key1 || secret_key2);
                return payload;
            }
            catch (error) {
                console.error('Error al verificar el token:', error);
                return null;
            }
        }
    }
}
exports.paymentontroller = new Paymentontroller();
