import { Router } from "express";

import { createContact, deleteContact, getContact, getContactById, updateContact } from "../controllers/contact.controller.js";

const router = Router();

router.get('/', getContact);
router.get('/:idContact', getContactById);
router.post('/', createContact);
router.patch('/:idContact', updateContact);
router.delete('/:idContact', deleteContact);

export default router;