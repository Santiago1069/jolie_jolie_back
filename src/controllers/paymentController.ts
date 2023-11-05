import { Request, Response } from 'express';
import mercadopago = require("mercadopago")
import jwt from 'jsonwebtoken';

import { transporter } from './configEmail';
import { listProductsController } from './listProductsController';
import { stringify } from 'uuid';
import { CartProduct } from '../../../jolie_jolie_front_new/src/app/models/CartProduct';
import { Product } from '../models/product';


class Paymentontroller {
    public async createOrder(req: Request, res: Response) {
        let {carrito}=req.body
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
        var html:String=this.carritoToString(carrito);

        const payload = jwt.verify(token, secret_key1 || secret_key2) as { [key: string]: any };
        
        let info = await transporter.sendMail({
            from: '"Jolie Jolie 🛍️"',
            to: payload.correo,
            subject: "Compra en la tienda JOLIE JOLIE 💰",
            html: ' <h2>Compra exitosa</h2>' +
            '<p>Estimado usuario,</p>' +
            '<p>Hemos recibido una solicitud de compra y el estado fue exitosa.</p>' +
            '<p><strong>Compraste:</strong></p><br>' +html+
            '<br><p>Muchas gracias por tu compra</p>' +
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

    public  carritoToString(carrito:any[]):String{
        var html=""
        for (let i = 0; i < carrito.length; i++) {
            html+='<div><img src="' + carrito[i].imagen + '"  alt="imagen del producto" width="346.17" height="346.17">' +
            '<p><strong>Nombre del producto: </strong>' + carrito[i].nombre_producto + ' </p>' +
            '<p><strong>Cantidad: </strong>' + carrito[0].cantidad + ' </p>' +
            '<p><strong>Precio: </strong> $' + carrito[0].precio + ' </p></div>' 
        }
        return html
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