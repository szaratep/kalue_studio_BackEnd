import { Router } from 'express';
import { createOrder, deleteOrder, getOrder, getOrderById, updateOrder } from '../controllers/order.controllers.js';

const router = Router();

router.get('/', getOrder);
router.get('/:idOrder', getOrderById);
router.post('/', createOrder);
router.patch('/:idOrder', updateOrder);
router.delete('/:idOrder', deleteOrder);

export default router;
