import express from 'express';
import {
  addWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
  checkInAttendance,
  getAttendance,
} from '../controllers/worker.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Worker Profiles
router
  .route('/')
  .post(authorize('owner', 'manager'), addWorker)
  .get(getWorkers);

router
  .route('/:id')
  .put(authorize('owner', 'manager'), updateWorker)
  .delete(authorize('owner', 'manager'), deleteWorker);

// Attendance sheets
router.post('/attendance/check-in', authorize('owner', 'manager'), checkInAttendance);
router.get('/attendance', getAttendance);

export default router;
