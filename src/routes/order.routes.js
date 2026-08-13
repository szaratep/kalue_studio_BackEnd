import { Router } from 'express';

import { createOrder, deleteOrder, getOrder, getOrderById, updateOrder } from '../controllers/order.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import { ROLES } from '../config/golbal.config.js';
import authorizationUser from '../middlewares/authorization.middleware.js';

const router = Router();

router.get('/', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), getOrder);
router.get('/:id', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), getOrderById);
router.post('/', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), createOrder);
router.patch('/:id', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), updateOrder);
router.delete('/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), deleteOrder);

export default router;
