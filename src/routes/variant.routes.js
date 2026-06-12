import { Router } from 'express';

import {createVariant, getVariant, getVariantById, updateVariant, deleteVariant} from '../controllers/variant.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import { ROLES } from '../config/golbal.config.js';
import authorizationUser from '../middlewares/authorization.middleware.js';

const router = Router();

router.get('/', getVariant);
router.get('/:id', getVariantById);
router.post('/', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), createVariant);
router.patch('/:id', authenticationUser, authorizationUser([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.EDITOR]), updateVariant);
router.delete('/:id', authenticationUser, authorizationUser([ROLES.ADMIN]), deleteVariant);

export default router;