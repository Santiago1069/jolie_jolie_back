import { Router } from "express";
import { paymentontroller } from "../controllers/paymentController";

class PaymentRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {

        this.router.get('/payment', paymentontroller.createOrder);
        this.router.post('/webhook', paymentontroller.getWebhook);


        this.router.get('/success', paymentontroller.successCompra);
        this.router.get('/failure', paymentontroller.failureCompra);
        this.router.get('/pending');

    }

}
    const paymentRoutes = new PaymentRoutes();
export default paymentRoutes.router;