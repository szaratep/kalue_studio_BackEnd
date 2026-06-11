import { Router } from 'express';

import {createVariant, getVariant, getVariantById, updateVariant, deleteVariant} from '../controllers/variant.controller.js';

const router = Router();

router.get('/', getVariant);
router.get('/:id', getVariantById);
router.post('/', createVariant);
router.patch('/:id', updateVariant);
router.delete('/:id', deleteVariant);

export default router;