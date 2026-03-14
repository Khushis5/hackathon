import express from 'express';
import {
  create, getAll, getOne,
  update, remove, launch, pause
} from './campaign.controller.js';
import protect from '../../middleware/auth.middleware.js';
import allowRoles from '../../middleware/rbac.middleware.js';

const router = express.Router();

// All routes protected
router.use(protect);

router.post('/', allowRoles('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', allowRoles('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), update);
router.delete('/:id', allowRoles('SUPER_ADMIN'), remove);
router.post('/:id/launch', allowRoles('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), launch);
router.post('/:id/pause', allowRoles('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), pause);

export default router;