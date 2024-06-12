"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
const validateToken_1 = require("../controllers/validateToken");
class UsersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/users', validateToken_1.validateToken.validate, usersController_1.usersController.all_users);
        this.router.get('/user/:id', validateToken_1.validateToken.validate, usersController_1.usersController.getOneUser);
        this.router.post('/user', validateToken_1.validateToken.validate, usersController_1.usersController.createUser);
        this.router.delete('/user/:id', validateToken_1.validateToken.validate, usersController_1.usersController.deleteUser);
        this.router.put('/user/:id', validateToken_1.validateToken.validate, usersController_1.usersController.updateUser);
        this.router.get('/profiles', validateToken_1.validateToken.validate, usersController_1.usersController.getProfiles);
        this.router.get('/documents', usersController_1.usersController.getTipeDocument);
        this.router.post('/validateEmail', usersController_1.usersController.validateEmail);
        this.router.post('/cambiarPassword', validateToken_1.validateToken.validate, usersController_1.usersController.cambiarPassword);
    }
}
const usersRoutes = new UsersRoutes();
exports.default = usersRoutes.router;
