import express from 'express';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expense.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('owner', 'accountant'), addExpense)
  .get(getExpenses);

router
  .route('/:id')
  .put(authorize('owner', 'accountant'), updateExpense)
  .delete(authorize('owner'), deleteExpense);

export default router;
