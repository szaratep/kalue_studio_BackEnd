import {Router} from 'express'

import { getUser, createUser, deleteUser, updateUser, getUserById } from '../controllers/user.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';

const router = Router();

//Definicion de las rutas para los usuarios
router.get('/', authenticationUser, getUser);
router.get('/:idUser', authenticationUser, getUserById);
router.post ( '/', authenticationUser, createUser);
router.delete ( '/:idUser', authenticationUser, deleteUser);
router.patch ( '/:idUser', authenticationUser, updateUser);

export default router;