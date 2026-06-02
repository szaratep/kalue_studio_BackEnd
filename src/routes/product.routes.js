import {Router} from 'express';



import { createProduct, deleteProduct, getProduct, GetProductById, updateProduct } from '../controllers/product.controllers.js';


const router = Router();


router.get( '/', getProduct);
router.get( '/:id', GetProductById);
router.post( '/', createProduct );
router.patch( '/:id', updateProduct );
router.delete( '/:id', deleteProduct );


export default router;
