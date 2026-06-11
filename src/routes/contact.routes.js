import { Router } from "express";

import { createContact, deleteContact, getContact, getContactById, updateContact } from "../controllers/contact.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";

const router = Router();

router.get('/', authenticationUser, getContact);
router.get('/:idContact', authenticationUser, getContactById);
router.post('/', authenticationUser, createContact);
router.patch('/:idContact', authenticationUser, updateContact);
router.delete('/:idContact', authenticationUser, deleteContact);

export default router;