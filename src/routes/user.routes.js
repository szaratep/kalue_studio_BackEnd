import {Router} from 'express'

import { getUser, createUser, deleteUser, updateUser, getUserById } from '../controllers/user.controller.js';

const router = Router();

//Definicion de las rutas para los usuarios
router.get('/', getUser);
router.get('/:idUser', getUserById);
router.post ( '/', createUser);
router.delete ( '/:idUser', deleteUser);
router.patch ( '/:idUser', updateUser);

export default router;