import express from 'express';
import {
  getNotices,
  createNotice,
  acknowledgeNotice
} from '../controllers/noticeController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getNotices);
router.post('/', requireRole('admin'), createNotice);
router.post('/:id/acknowledge', acknowledgeNotice);

export default router;
