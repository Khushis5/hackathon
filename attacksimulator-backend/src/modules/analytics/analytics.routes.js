import express from 'express';
import {
  dashboard,
  campaignStats,
  departmentStats,
  trends
} from './analytics.controller.js';
import protect from '../../middleware/auth.middleware.js';
import allowRoles from '../../middleware/rbac.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', dashboard);
router.get('/campaign/:id', campaignStats);
router.get('/departments', departmentStats);
router.get('/trends', trends);

export default router;