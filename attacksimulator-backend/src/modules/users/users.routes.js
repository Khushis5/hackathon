import express from 'express';
import {
  getAll, getOne, getMe,
  update, remove, updatePassword
} from './users.controller.js';
import protect from '../../middleware/auth.middleware.js';
import allowRoles from '../../middleware/rbac.middleware.js';

const router = express.Router();

// All routes protected
router.use(protect);

router.get('/me', getMe);
router.put('/me/password', updatePassword);
router.get('/', allowRoles('SUPER_ADMIN'), getAll);
router.get('/:id', allowRoles('SUPER_ADMIN'), getOne);
router.put('/:id', allowRoles('SUPER_ADMIN'), update);
router.delete('/:id', allowRoles('SUPER_ADMIN'), remove);

export default router;