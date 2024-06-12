"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const managementProductsController_1 = require("../controllers/managementProductsController");
const validateToken_1 = require("../controllers/validateToken");
class ManagementProductsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/ManagementProduct/:id', validateToken_1.validateToken.validate, managementProductsController_1.managementProductsController.getOneProduct);
        this.router.post('/ManagementProduct', validateToken_1.validateToken.validate, managementProductsController_1.managementProductsController.createProduct);
        this.router.delete('/ManagementProduct/:id', validateToken_1.validateToken.validate, managementProductsController_1.managementProductsController.deleteProduct);
        this.router.put('/ManagementProduct/:id', validateToken_1.validateToken.validate, managementProductsController_1.managementProductsController.updateProduct);
        this.router.get('/categories', validateToken_1.validateToken.validate, managementProductsController_1.managementProductsController.getCategories);
    }
}
const managementProductsRoutes = new ManagementProductsRoutes();
exports.default = managementProductsRoutes.router;
