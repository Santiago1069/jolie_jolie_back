import express, { Application, application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';

import listProductsRoutes from './routes/listProductsRoutes';
import managementProductsRoutes from './routes/managementProductsRoutes';
import loginRoutes from './routes/login';
import usersRoutes from './routes/usersRoutes';
import listComprasRoutes from './routes/listComprasRoutes';
import paymentRoutes from './routes/paymentRoutes';
import contactRoutes from './routes/contactRoutes';




class Server {

    public app: Application;


    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        dotenv.config(); 
        this.app.set('port', process.env.PORT || 4000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes(): void {
        this.app.use(listProductsRoutes);
        this.app.use(managementProductsRoutes);
        this.app.use(loginRoutes);
        this.app.use(usersRoutes);
        this.app.use(listComprasRoutes);
        this.app.use(paymentRoutes);
        this.app.use(contactRoutes);

    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server esta en el puerto ', this.app.get('port'));
            console.log('Dar clic en --> http://localhost:3000');
        });
    }

}

const server = new Server();
server.start();