import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectDashboard,
} from '../controllers/project.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('owner', 'manager'), createProject)
  .get(getProjects);

router
  .route('/:id')
  .get(getProjectById)
  .put(authorize('owner', 'manager'), updateProject)
  .delete(authorize('owner'), deleteProject);

router.get('/:id/dashboard', getProjectDashboard);

export default router;
