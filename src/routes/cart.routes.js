import { Router } from 'express';

import {createCart, getCart, getCartById, updateCart, deleteCart} from '../controllers/cart.controller.js';

const router = Router();

router.get('/', getCart);
router.get('/:id', getCartById);
router.post('/', createCart);
router.patch('/:id', updateCart);
router.delete('/:id', deleteCart);

export default router;