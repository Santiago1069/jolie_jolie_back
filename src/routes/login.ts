import { Router } from 'express';

import { loginController } from '../controllers/login'
import { validateToken } from '../controllers/validateToken';


class LoginRoutes {

    public router = Router();


    constructor(){
        this.config();
       }


       config(): void {
        this.router.post('/newUser', loginController.createUser);
        this.router.post('/loginUser', loginController.loginUser);

        this.router.get('/profile',  validateToken.validate, loginController.profile)
       }

}


const loginRoutes = new LoginRoutes();
export default loginRoutes.router;