import {Router} from 'express'

import { getUser, createUser, deleteUser, updateUser, getUserById, getUserByIdPublic, updateUserSelf } from '../controllers/user.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';
import { ALLOWED_ROLES, ROLES } from '../config/golbal.config.js';
import { handleUploadAvatar } from '../middlewares/handleUploadAvatar.middleware.js';

const router = Router();

//Ruta publica para obtener un usuraio especifico
router.get('/details', authenticationUser,authorizationUser(ALLOWED_ROLES), getUserByIdPublic);
router.patch('/details', authenticationUser, authorizationUser([ROLES.SUSCRIBER]),handleUploadAvatar, updateUserSelf);

//Definicion de las rutas para los usuarios
router.get('/',  authenticationUser, authorizationUser([ROLES.ADMIN]), getUser);
router.get('/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), getUserById);
router.post ( '/', authenticationUser, authorizationUser([ROLES.ADMIN]), handleUploadAvatar, createUser);
router.delete ( '/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), handleUploadAvatar, deleteUser);
router.patch ( '/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), handleUploadAvatar, updateUser);

export default router;