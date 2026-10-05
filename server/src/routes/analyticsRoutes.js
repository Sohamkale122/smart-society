import express from 'express';
import { getDashboardStats, getResidentsDirectory } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/residents', getResidentsDirectory);

export default router;
