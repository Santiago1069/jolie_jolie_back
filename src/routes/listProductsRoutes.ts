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

    this.router.get('/products', listProductsController.allProductsActivate);

    this.router.get('/productbyid', validateToken.validate, listProductsController.productobyid);

    this.router.post('/productsCard',listProductsController.allProductscard);
    
    this.router.post('/productsCard/cantidad',listProductsController.allProductscard);



   }
   
}

const listProductsRoutes = new ListProductsRoutes();
export default listProductsRoutes.router;