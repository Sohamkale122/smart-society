import express from 'express';
import {
  getVisitors,
  getVisitorById,
  createVisitor,
  updateVisitorStatus,
  verifyPassCode
} from '../controllers/visitorController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getVisitors);
router.get('/verify/:code', verifyPassCode);
router.get('/:id', getVisitorById);
router.post('/', createVisitor);
router.patch('/:id/status', updateVisitorStatus);

export default router;
