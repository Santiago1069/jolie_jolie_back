import { Router } from "express";
import { validateToken } from "../controllers/validateToken";
import { contactController } from "../controllers/contactController";

class ContactRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {

        this.router.post('/contact', validateToken.validate, contactController.createMensaje);
        this.router.get('/contact', validateToken.validate, contactController.getMensajes);

    }

}

const contactRoutes = new ContactRoutes();
export default contactRoutes.router;