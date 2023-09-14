import nodemailer from "nodemailer";
require('dotenv').config();


export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.CONFIGEMAIL_AUTH_USER, 
        pass: process.env.CONFIGEMAIL_AUTH_PASS,
    },
});

transporter.verify().then(() => {
    console.log('Listo para enviar correos');
    
})