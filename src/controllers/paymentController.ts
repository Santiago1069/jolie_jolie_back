import { Request, Response } from 'express';
import mercadopago = require("mercadopago")
import jwt from 'jsonwebtoken';

import { transporter } from './configEmail';
import { query } from '../dataBaseConfig';
import { listProductsController } from './listProductsController';
import { uuid } from 'uuidv4';


class Paymentontroller {

    public static myUUID: string = uuid();
    public static uuidWithoutLetters: string = Paymentontroller.myUUID.replace(/\D/g, '');

    public async createOrder(req: Request, res: Response) {

        const header_token = req.headers['authorization']
        const token = header_token!.slice(7);

        const secret_key1 = process.env.TOKEN_SECRET_KEY1;
        const secret_key2 = process.env.TOKEN_SECRET_KEY2;

        if (!secret_key1 || !secret_key2) {
            console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
            process.exit(1);
        }
        const payload = jwt.verify(token, secret_key1 || secret_key2) as { [key: string]: any };

        var carrito = await listProductsController.allProductsCardfunsion(payload.identificacion);

        var item: Array<any> = [];
        if (!carrito) {
            console.error('El carrito es undefined.');
            res.status(500).send('Error interno del servidor');
            return;
        } else {
            for (let i = 0; i < carrito.length; i++) {
                item.push({
                    title: carrito[i].nombre_producto,
                    unit_price: carrito[i].precio,
                    currency_id: "COP",
                    quantity: carrito[i].cantidad,
                    picture_url: carrito[i].imagen
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
        const result = await mercadopago.preferences.create({
            items: item,
            back_urls: {
                success: "http://localhost:4200/success",
                failure: "http://localhost:4200/failure",
                pending: "http://localhost:3000/pending"
            },
            notification_url: "https://0dc1-206-84-81-108.ngrok-free.app/webhook",
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

                        let info = await transporter.sendMail({
                            from: '"Jolie Jolie 🛍️"',
                            to: 'santiago_sandoval23201@elpoli.edu.co',
                            subject: "Compra en la tienda JOLIE JOLIE 💰",
                            html: '<h2 class="display-4">Compra exitosa</h2>' +
                                '<p class="lead">Estimado usuario,</p>' +
                                '<p>Hemos recibido una solicitud de compra y el estado fue exitoso.</p>' +
                                '<div class="mb-3">' + html + '</div>' +
                                '<p class="lead">Muchas gracias por tu compra</p>' +
                                '<p class="lead"><strong>El equipo de JOLIE JOLIE</strong></p>',
                        });

                        console.log('data.body');
                        console.log(data.body);

                        const createCompra = await query(
                            `UPDATE COMPRAS SET ESTADO = :0, METODOPAGO = :1 WHERE ID_USUARIO_FK = :2`,
                            [1, data.body.payment_method.type, '1212212121'],
                        );
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
        let id_compra = parseInt(Paymentontroller.uuidWithoutLetters, 10);
        const fechaOriginal = new Date();
        const año = fechaOriginal.getFullYear();
        const mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, '0');
        const día = fechaOriginal.getDate().toString().padStart(2, '0');

        const fechaFormateada = `${año}-${mes}-${día}`

        const createCompra = await query(
            `INSERT INTO COMPRAS (ID_COMPRA, FECHA, DIRECCION, ESTADO, VALOR_TOTAL, CANTIDAD_PRODUCTOS, ID_USUARIO_FK, ID_ZONA_FK, METODOPAGO) VALUES (:0, TO_DATE(:1, 'YYYY - MM - DD'), :2, :3, :4, :5, :6, :7, :8)`,
            [id_compra, fechaFormateada, req.body.direccion, req.body.estado, req.body.valor_total, req.body.cantidad_productos, req.body.id_usuario_fk, req.body.id_zona_fk, req.body.metodopago]
        );

        console.log('id_compra');
        console.log(id_compra);

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
        let id_compra = parseInt(Paymentontroller.uuidWithoutLetters, 10);
        for (let i = 0; i < req.body.length; i++) {
            let id_compra_productos = Math.floor(Math.random() * 2000000)
            let valor_total = req.body[i].quantityProducts * req.body[i].price;
            const createCompraProducts = await query(
                `INSERT INTO COMPRAS_PRODUCTOS (ID_COMPRAS_PRODUCTOS, ID_COMPRA_FK, ID_PRODUCTO_FK, CANTIDAD, VALOR_UNIDAD, VALOR_TOTAL) VALUES (:0, :1, :2, :3, :4, :5)`,
                [id_compra_productos, id_compra, req.body[i].id_producto, req.body[i].quantityProducts, req.body[i].price, valor_total]
            )
            id_compra_productos = 0;
        }

        res.json({
            msg: `La compra en total tiene ${req.body.length} productos`
        })

    }

    static generarNuevoIdCompra(): number {
        const numeroAleatorio = Math.random();
        const idCompra = Math.floor(numeroAleatorio * 1000000);
        return idCompra;
    }


}

export const paymentontroller = new Paymentontroller();