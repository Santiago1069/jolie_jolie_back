import { Router } from "express";
import { usersController } from "../controllers/usersController";
import { validateToken } from "../controllers/validateToken";

class UsersRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {

        this.router.get('/users', validateToken.validate, usersController.all_users);
        this.router.get('/user/:id', validateToken.validate, usersController.getOneUser);
        this.router.post('/user', validateToken.validate, usersController.createUser);
        this.router.delete('/user/:id', validateToken.validate, usersController.deleteUser);
        this.router.put('/user/:id', validateToken.validate, usersController.updateUser);

        this.router.get('/profiles', validateToken.validate, usersController.getProfiles);

        this.router.get('/documents', usersController.getTipeDocument);
        this.router.post('/validateEmail', usersController.validateEmail);
        this.router.post('/cambiarPassword', validateToken.validate, usersController.cambiarPassword )

    }

}

const usersRoutes = new UsersRoutes();
export default usersRoutes.router;