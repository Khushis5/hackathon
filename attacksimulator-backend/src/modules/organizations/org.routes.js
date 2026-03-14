import express from 'express';
import { create, getAll, getOne, update, remove, getMembers } from './org.controller.js';
import protect from '../../middleware/auth.middleware.js';
import allowRoles from '../../middleware/rbac.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', allowRoles('SUPER_ADMIN'), create);
router.get('/', allowRoles('SUPER_ADMIN'), getAll);
router.get('/:id', allowRoles('SUPER_ADMIN'), getOne);
router.put('/:id', allowRoles('SUPER_ADMIN'), update);
router.delete('/:id', allowRoles('SUPER_ADMIN'), remove);
router.get('/:id/members', allowRoles('SUPER_ADMIN'), getMembers);

export default router;