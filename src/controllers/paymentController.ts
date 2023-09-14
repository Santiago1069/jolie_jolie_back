import { Request, Response } from 'express';
import mercadopago = require("mercadopago")
import jwt from 'jsonwebtoken';

import { transporter } from './configEmail';


class Paymentontroller {


    public async createOrder(req: Request, res: Response) {

        const mercadopagoAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

        if (!mercadopagoAccessToken) {
            console.error('La variable de entorno MERCADOPAGO_ACCESS_TOKEN no está definida.');
            process.exit(1);
        }


        mercadopago.configure({
            access_token: mercadopagoAccessToken
        });

        const result = await mercadopago.preferences.create({
            items: [{
                title: "Gorro Negro",
                unit_price: 25000,
                currency_id: "COP",
                quantity: 1,
                picture_url: "https://thenorthfaceco.vteximg.com.br/arquivos/ids/185714-861-1000/NF0A3FNTJK3--1-.jpg?v=637443321759530000"

            }],
            back_urls: {
                success: "http://localhost:4200/success",
                failure: "http://localhost:4200/failure",
                pending: "http://localhost:3000/pending"
            },
            notification_url: "https://2859-179-12-183-83.ngrok.io/webhook",
        });

        const header_token = req.headers['authorization']
        const token = header_token!.slice(7);

        const secret_key1 = process.env.TOKEN_SECRET_KEY1;
        const secret_key2 = process.env.TOKEN_SECRET_KEY2;

        if (!secret_key1 || !secret_key2) {
            console.error('Las variables de entorno TOKEN_SECRET_KEY1 o TOKEN_SECRET_KEY2 no están definidas.');
            process.exit(1);
        }

        const payload = jwt.verify(token, secret_key1 || secret_key2) as { [key: string]: any };


        let info = await transporter.sendMail({
            from: '"Jolie Jolie 🛍️"',
            to: payload.correo,
            subject: "Compra en la tienda JOLIE JOLIE 💰",
            html: ' <h2>Compra exitosa</h2>' +
                '<p>Estimado usuario,</p>' +
                '<p>Hemos recibido una solicitud de compra y el estado fue exitosa.</p>' +
                '<p><strong>Compraste:</strong></p>' +
                '<img src="' + result.body.items[0].picture_url + '"  alt="imagen del producto" width="346.17" height="346.17">' +
                '<p><strong>Nombre del producto: </strong>' + result.body.items[0].title + ' </p>' +
                '<p><strong>Cantidad: </strong>' + result.body.items[0].quantity + ' </p>' +
                '<p><strong>Precio: </strong> $' + result.body.items[0].unit_price + ' </p>' +
                '<p>Muchas gracias por tu compra</p>' +
                '<p><strong>El equipo de JOLIE JOLIE</strong></p>',
        });


        res.send(result.body)
    }


    public async getWebhook(req: Request, res: Response) {

        const payment = req.query;
        const paymentId = payment["data.id"];


        if (payment.type === "payment") {
            if (typeof paymentId === 'number') {
                const data = await mercadopago.payment.findById(paymentId);
                console.log(data);
            }
        }
        res.sendStatus(204)

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

}

export const paymentontroller = new Paymentontroller();