import { Router } from 'express';

import {createVariant, getVariant, getVariantById, updateVariant, deleteVariant} from '../controllers/variant.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';

const router = Router();

router.get('/', getVariant);
router.get('/:id', getVariantById);
router.post('/', authenticationUser, createVariant);
router.patch('/:id', authenticationUser, updateVariant);
router.delete('/:id', authenticationUser, deleteVariant);

export default router;