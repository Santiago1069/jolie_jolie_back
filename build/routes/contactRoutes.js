"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateToken_1 = require("../controllers/validateToken");
const contactController_1 = require("../controllers/contactController");
class ContactRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/contact', validateToken_1.validateToken.validate, contactController_1.contactController.createMensaje);
        this.router.get('/contact', validateToken_1.validateToken.validate, contactController_1.contactController.getMensajes);
    }
}
const contactRoutes = new ContactRoutes();
exports.default = contactRoutes.router;
