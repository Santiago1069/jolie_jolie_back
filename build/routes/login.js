"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/login");
const validateToken_1 = require("../controllers/validateToken");
class LoginRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/newUser', login_1.loginController.createUser);
        this.router.post('/loginUser', login_1.loginController.loginUser);
        this.router.get('/profile', validateToken_1.validateToken.validate, login_1.loginController.profile);
    }
}
const loginRoutes = new LoginRoutes();
exports.default = loginRoutes.router;
