import { Router } from "express";

import { managementProductsController } from '../controllers/managementProductsController'
import { validateToken } from "../controllers/validateToken";

class ManagementProductsRoutes{

   public router: Router = Router();

   constructor(){
    this.config();
   }

   config(): void {

      this.router.get('/ManagementProduct/:id', validateToken.validate, managementProductsController.getOneProduct);
      this.router.post('/ManagementProduct', validateToken.validate, managementProductsController.createProduct);
      this.router.delete('/ManagementProduct/:id', validateToken.validate, managementProductsController.deleteProduct);
      this.router.put('/ManagementProduct/:id', validateToken.validate, managementProductsController.updateProduct);


      this.router.get('/categories', validateToken.validate,managementProductsController.getCategories);
      

   }
}

const managementProductsRoutes = new ManagementProductsRoutes();
export default managementProductsRoutes.router;