import { Router } from "express";
import { listComprasController } from "../controllers/listComprasController";

import { validateToken } from "../controllers/validateToken";

class ListComprasRoutes{

   public router: Router = Router();

   constructor(){
    this.config();
   }

   config(): void {
      
    this.router.get('/compras', validateToken.validate, listComprasController.compras);


    this.router.get('/mis-compras', validateToken.validate, listComprasController.misCompras);
   }

  
   
}

const listComprasRoutes = new ListComprasRoutes();
export default listComprasRoutes.router;