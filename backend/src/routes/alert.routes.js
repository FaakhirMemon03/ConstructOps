import express from 'express';
import { getAlerts, markAlertRead } from '../controllers/alert.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getAlerts);
router.route('/:id/read').put(markAlertRead);

export default router;
