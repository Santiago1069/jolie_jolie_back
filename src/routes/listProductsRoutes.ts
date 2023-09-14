import { Router } from "express";

import { listProductsController } from '../controllers/listProductsController';
import { validateToken } from "../controllers/validateToken";

class ListProductsRoutes{

   public router: Router = Router();

   constructor(){
    this.config();
   }

   config(): void {
      
    this.router.get('/admin/products', validateToken.validate, listProductsController.all_products);

    this.router.get('/products', validateToken.validate, listProductsController.allProductsActivate);

   }
   
}

const listProductsRoutes = new ListProductsRoutes();
export default listProductsRoutes.router;