import { Router } from 'express';

import { createOrder, deleteOrder, getOrder, getOrderById, updateOrder } from '../controllers/order.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';

const router = Router();

router.get('/', authenticationUser, getOrder);
router.get('/:idOrder', authenticationUser, getOrderById);
router.post('/', authenticationUser, createOrder);
router.patch('/:idOrder', authenticationUser, updateOrder);
router.delete('/:idOrder', authenticationUser, deleteOrder);

export default router;
