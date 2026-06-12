import { Router } from 'express';

import { createOrder, deleteOrder, getOrder, getOrderById, updateOrder } from '../controllers/order.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import { ROLES } from '../config/golbal.config.js';
import authorizationUser from '../middlewares/authorization.middleware.js';

const router = Router();

router.get('/', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), getOrder);
router.get('/:idOrder', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), getOrderById);
router.post('/', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), createOrder);
router.patch('/:idOrder', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), updateOrder);
router.delete('/:idOrder', authenticationUser, authorizationUser([ROLES.ADMIN]), deleteOrder);

export default router;
