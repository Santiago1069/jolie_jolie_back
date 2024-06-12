"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
class PaymentRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/payment', paymentController_1.paymentontroller.createOrder);
        this.router.post('/webhook', paymentController_1.paymentontroller.getWebhook);
        this.router.get('/success', paymentController_1.paymentontroller.successCompra);
        this.router.get('/failure', paymentController_1.paymentontroller.failureCompra);
        this.router.get('/pending');
        this.router.post('/createCompra', paymentController_1.paymentontroller.createCompra);
        this.router.post('/createComprasProduct/:id', paymentController_1.paymentontroller.createComprasProduct);
    }
}
const paymentRoutes = new PaymentRoutes();
exports.default = paymentRoutes.router;
