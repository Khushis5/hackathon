import express from 'express';
import { track, click, getByCampaign, getStats, getAll } from './tracking.controller.js';
import protect from '../../middleware/auth.middleware.js';
import allowRoles from '../../middleware/rbac.middleware.js';

const router = express.Router();

// Public routes - no auth needed (simulated users clicking links)
router.post('/event', track);
router.get('/click', click);

// Protected routes
router.use(protect);
router.get('/', allowRoles('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), getAll);
router.get('/campaign/:campaignId', getByCampaign);
router.get('/campaign/:campaignId/stats', getStats);

export default router;