import nodemailer from "nodemailer";
require('dotenv').config();


export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user:"jolie.jolie.app@gmail.com", 
        pass: "ftxjnlajfxfoqmsy",
    },
});

transporter.verify().then(() => {
    console.log('Listo para enviar correos');
    
})