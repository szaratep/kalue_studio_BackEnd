import {Router} from 'express';

import { createProduct, deleteProduct, getProduct, getProductById, updateProduct } from '../controllers/product.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';

const router = Router();

router.get( '/', getProduct);
router.get( '/:id', getProductById);
router.post( '/', authenticationUser, createProduct );
router.patch( '/:id', authenticationUser, updateProduct );
router.delete( '/:id', authenticationUser, deleteProduct );


export default router;
