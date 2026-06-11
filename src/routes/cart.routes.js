import { Router } from 'express';

import {createCart, getCart, getCartById, updateCart, deleteCart} from '../controllers/cart.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';

const router = Router();

router.get('/', getCart);
router.get('/:id',  authenticationUser, getCartById);
router.post('/', authenticationUser, createCart);
router.patch('/:id', authenticationUser, updateCart);
router.delete('/:id', authenticationUser, deleteCart);

export default router;