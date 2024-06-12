import { Request, Response } from 'express';
import mercadopago = require("mercadopago")
import jwt from 'jsonwebtoken';
import { transporter } from './configEmail';
import { uuid } from 'uuidv4';
import { query } from '../dataBaseConfigMYSQL';
import { listProductsController } from './listProductsController';

class Paymentontroller {
    public async createOrder(req: Request, res: Response) {
        const payload = Paymentontroller.getPayloadToken(req);
        console.log('payload!.identificacion');
        console.log(payload!.identificacion);
        var carrito = await listProductsController.allProductsCardfunsion(payload!.identificacion);
        var item: Array<any> = [];
        if (!carrito) {
            console.error('El carrito es undefined.');
            res.status(500).send('Error interno del servidor');
            return;
        } else {
            for (let i = 0; i < carrito.length; i++) {
                item.push({
                    title: carrito[i]['nombre_producto'],
                    unit_price: carrito[i]['precio'],
                    currency_id: "COP",
                    quantity: carrito[i]['cantidad'],
                    picture_url: carrito[i]['imagen']
                })

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

        const result = await mercadopago.preferences.create({
            items: item,
            back_urls: {
                success: "http://localhost:4200/success",
                failure: "http://localhost:4200/failure",
                pending: "https://c3dnwtjj-4200.use2.devtunnels.ms/pending"
            },
            notification_url: "https://c3dnwtjj-4200.use2.devtunnels.ms/webhook",
            payer: {
                email: payload!.correo,
                identification: {
                    type: "CC",
                    number: payload!.identificacion
                }
            },
        });

        res.send(result.body)
    }
    public async getWebhook(req: Request, res: Response) {

        try {
            const payment = req.query;

            if (payment && typeof payment === 'object' && payment.type === "payment") {
                const dataId: string | undefined = (payment as any)["data.id"];

                if (dataId) {
                    const numericDataId: number = parseInt(dataId, 10);
                    const data = await mercadopago.payment.findById(numericDataId);

                    if (data.body.status === "approved") {

                        const createCompra = await query(
                            `UPDATE COMPRAS SET ESTADO_COMPRAS = ?, METODOPAGO = ? WHERE ID_USUARIO_FK = ?`,
                            [1, data.body.payment_method.type, data.body.payer.identification.number],
                        );

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

                        await transporter.sendMail({
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

                } else {
                    console.error("El ID de pago es undefined.");
                }
            } else {
                console.error("La consulta no tiene el formato esperado.");
            }
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something goes wrong" });

        }

    }


    public async successCompra(req: Request, res: Response) {
        res.json({
            msg: `La compra se ha realizado correctamente`
        })

    }

    public async failureCompra(req: Request, res: Response) {
        
        res.json({
            msg: `La compra no se completo correctamente`
        })
    }


    public async createCompra(req: Request, res: Response) {
        let id_compra = Paymentontroller.generarNuevoIdCompra();
        id_compra = id_compra.replace(/\./g, '');

        console.warn('id_compra');
        console.warn(id_compra);

        const fechaOriginal = new Date();
        const año = fechaOriginal.getFullYear();
        const mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, '0');
        const día = fechaOriginal.getDate().toString().padStart(2, '0');

        const fechaFormateada = `${año}-${mes}-${día}`
        const createCompra = await query('INSERT INTO COMPRAS (ID_COMPRA, FECHA, DIRECCION, ESTADO_COMPRAS, VALOR_TOTAL, CANTIDAD_PRODUCTOS, ID_USUARIO_FK, ID_ZONA_FK, ID_METODOPAGO_FK) VALUES (?,STR_TO_DATE(?,"%Y-%m-%d"), ?, ?, ?, ?, ?, ?, ?)',
            [id_compra, fechaFormateada, req.body.direccion, req.body.estado, req.body.valor_total, req.body.cantidad_productos, req.body.id_usuario_fk, req.body.id_zona_fk, req.body.metodopago]
        );

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


    }

    public async createComprasProduct(req: Request, res: Response) {
        const id_compra = req.params.id;
        for (let i = 0; i < req.body.length; i++) {
            let id_compra_productos = Math.floor(Math.random() * 2000000)
            let valor_total = req.body[i].quantityProducts * req.body[i].price;
            const createCompraProducts = await query(
                `INSERT INTO COMPRAS_PRODUCTOS (ID_COMPRAS_PRODUCTOS, ID_COMPRA_FK, ID_PRODUCTO_FK, CANTIDAD, VALOR_UNIDAD, VALOR_TOTAL) VALUES (?, ?, ?, ?, ?, ?)`,
                [id_compra_productos, id_compra, req.body[i].id_producto, req.body[i].quantityProducts, req.body[i].price, valor_total]
            )
            id_compra_productos = 0;
        }

        res.json({
            msg: `La compra en total tiene ${req.body.length} productos`
        })

    }

    private static generarNuevoIdCompra(): string {
        const myUUID: string = uuid();
        let result = "";
        const uuidWithoutLetters: string = myUUID.replace(/\D/g, '');
        for (var i = 0; i < 9; i++) {
            result = result + uuidWithoutLetters[i]
        }
        return result;
    }

    public static getPayloadToken(req: Request): any {

        const header_token = req.headers['authorization'];

        if (header_token != undefined && header_token.startsWith('Bearer ')) {
            const token = header_token!.slice(7);

            const secret_key1 = process.env.TOKEN_SECRET_KEY1;
            const secret_key2 = process.env.TOKEN_SECRET_KEY2;

            if (!secret_key1 || !secret_key2) {
                console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
                process.exit(1);
            }

            try {
                const payload = jwt.verify(token, secret_key1 || secret_key2) as { [key: string]: any };
                return payload;
            } catch (error) {
                console.error('Error al verificar el token:', error);
                return null;
            }
        }
    }



}

export const paymentontroller = new Paymentontroller();