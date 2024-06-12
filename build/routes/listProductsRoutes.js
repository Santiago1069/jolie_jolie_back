"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listProductsController_1 = require("../controllers/listProductsController");
const validateToken_1 = require("../controllers/validateToken");
class ListProductsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/admin/products', validateToken_1.validateToken.validate, listProductsController_1.listProductsController.all_products);
        this.router.get('/products', listProductsController_1.listProductsController.allProductsActivate);
        this.router.get('/productbyid', validateToken_1.validateToken.validate, listProductsController_1.listProductsController.productobyid);
        this.router.post('/productsCard', listProductsController_1.listProductsController.allProductscard);
        this.router.post('/productsCard/cantidad', listProductsController_1.listProductsController.allProductscard);
    }
}
const listProductsRoutes = new ListProductsRoutes();
exports.default = listProductsRoutes.router;
