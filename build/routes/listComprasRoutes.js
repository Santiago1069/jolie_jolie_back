"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listComprasController_1 = require("../controllers/listComprasController");
const validateToken_1 = require("../controllers/validateToken");
class ListComprasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/compras', validateToken_1.validateToken.validate, listComprasController_1.listComprasController.compras);
        this.router.get('/mis-compras', validateToken_1.validateToken.validate, listComprasController_1.listComprasController.misCompras);
    }
}
const listComprasRoutes = new ListComprasRoutes();
exports.default = listComprasRoutes.router;
