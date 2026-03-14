import express from 'express';
import { create, getAll, getOne, update, remove } from './template.controller.js';
import protect from '../../middleware/auth.middleware.js';
import allowRoles from '../../middleware/rbac.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', allowRoles('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', allowRoles('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), update);
router.delete('/:id', allowRoles('SUPER_ADMIN'), remove);

export default router;