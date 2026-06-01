import { Router } from 'express';

import {
    createVariant,
    getVariant,
    GetVariantById,
    updateVariant,
    deleteVariant
} from '../controllers/variant.controllers.js';

const router = Router();

router.get('/', getVariant);
router.get('/:id', GetVariantById);
router.post('/', createVariant);
router.patch('/:id', updateVariant);
router.delete('/:id', deleteVariant);

export default router;