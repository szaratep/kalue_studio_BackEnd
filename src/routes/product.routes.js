import {Router} from 'express';

import { createProduct, deleteProduct, getProduct, getProductById, updateProduct } from '../controllers/product.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';
import { ROLES } from '../config/golbal.config.js';

const router = Router();

router.get( '/', getProduct);
router.get( '/:id', getProductById);
router.post( '/', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), createProduct );
router.patch( '/:id', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), updateProduct );
router.delete( '/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), deleteProduct );


export default router;
