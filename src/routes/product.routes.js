import {Router} from 'express';

import { createProduct, deleteProduct, getProduct, getProductById, updateProduct } from '../controllers/product.controller.js';

const router = Router();

router.get( '/', getProduct);
router.get( '/:id', getProductById);
router.post( '/', createProduct );
router.patch( '/:id', updateProduct );
router.delete( '/:id', deleteProduct );


export default router;
