import {Router} from 'express'

import { getUser, createUser, deleteUser, updateUser, getUserById } from '../controllers/user.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';
import { ROLES } from '../config/golbal.config.js';

const router = Router();

//Definicion de las rutas para los usuarios
router.get('/',  authenticationUser, authorizationUser([ROLES.ADMIN]), getUser);
router.get('/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), getUserById);
router.post ( '/', authenticationUser, authorizationUser([ROLES.ADMIN]), createUser);
router.delete ( '/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), deleteUser);
router.patch ( '/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), updateUser);

export default router;