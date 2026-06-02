import { Router } from 'express';

import {
    createCart,
    getCart,
    GetCartById,
    updateCart,
    deleteCart
} from '../controllers/cart.controllers.js';

const router = Router();

router.get('/', getCart);
router.get('/:id', GetCartById);
router.post('/', createCart);
router.patch('/:id', updateCart);
router.delete('/:id', deleteCart);

export default router;