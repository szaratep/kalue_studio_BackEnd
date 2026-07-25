import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import authorizationUser from "../middlewares/authorization.middleware.js";
import { ROLES } from '../config/golbal.config.js';

const router = Router();

router.get( '/', getCategory);
router.get( '/:id', getCategoryById);
router.post( '/', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), createCategory );
router.patch( '/:id', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), updateCategory);
router.delete( '/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), deleteCategory);

export default router;