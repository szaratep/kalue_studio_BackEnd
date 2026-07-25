import { Router } from "express";

import { createContact, deleteContact, getContact, getContactById, updateContact } from "../controllers/contact.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import authorizationUser from "../middlewares/authorization.middleware.js";
import { ROLES } from "../config/golbal.config.js";

const router = Router();

router.get('/', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), getContact);
router.get('/:id', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), getContactById);
router.post('/', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), createContact);
router.patch('/:id', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), updateContact);
router.delete('/:id', authenticationUser, authorizationUser([ROLES.SUSCRIBER]), deleteContact);

export default router;