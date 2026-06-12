import { Router } from 'express';

import {createCart, getCart, getCartById, updateCart, deleteCart} from '../controllers/cart.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';
import { ROLES } from '../config/golbal.config.js';

const router = Router();

router.get('/', getCart);
router.get('/:id',  authenticationUser, authorizationUser([ROLES.SUSCRIBER]), getCartById);
router.post('/', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), createCart);
router.patch('/:id', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), updateCart);
router.delete('/:id', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), deleteCart);

export default router;