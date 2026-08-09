import { Router } from 'express';

import { getMyCart, updateMyCart, removeMyCartItem, deleteMyCart, getCart, getCartById, deleteCart } from '../controllers/cart.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';
import { ROLES } from '../config/golbal.config.js';

const router = Router();

// El carrito es una funcionalidad de cliente (subscriber): el propio id se
// resuelve desde el token, nunca desde la URL, por lo que basta con validar
// el rol para proteger estas rutas.
router.get('/me', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), getMyCart);
router.patch('/me', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), updateMyCart);
router.delete('/me/items/:productId', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), removeMyCartItem);
router.delete('/me', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), deleteMyCart);

// Herramientas administrativas: solo un ADMIN puede listar u operar sobre
// el carrito de cualquier usuario a partir de su _id de Mongo.
router.get('/', authenticationUser, authorizationUser([ROLES.ADMIN]), getCart);
router.get('/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), getCartById);
router.delete('/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), deleteCart);

export default router;