import { Router } from "express";
import { createMaterial, deleteMaterial, getMaterial, getMaterialById, updateMaterial } from "../controllers/material.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import authorizationUser from "../middlewares/authorization.middleware.js";
import { ROLES } from '../config/golbal.config.js';

const router = Router();

router.get( '/', getMaterial);
router.get( '/:idMaterial', getMaterialById);
router.post( '/', 
    // authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]),
     createMaterial );
router.patch( '/:idMaterial',
    //  authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]),
      updateMaterial);
router.delete( '/:idMaterial', 
    // authenticationUser, authorizationUser([ROLES.ADMIN]),
     deleteMaterial);

export default router;