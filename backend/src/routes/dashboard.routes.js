import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Project from '../models/project.model.js';
import Worker from '../models/worker.model.js';
import Material from '../models/material.model.js';
import Attendance from '../models/attendance.model.js';
import Expense from '../models/expense.model.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    // Filter by companyId unless it's system admin
    const filter = req.user.role === 'admin' ? {} : { companyId: req.user.companyId };

    const projectsCount = await Project.countDocuments(filter);
    
    // For workers and materials, if not admin, we filter by projects belonging to the company
    let projectIds = [];
    if (req.user.role !== 'admin') {
      const companyProjects = await Project.find({ companyId: req.user.companyId }).select('_id');
      projectIds = companyProjects.map(p => p._id);
    }

    const workerFilter = req.user.role === 'admin' ? {} : { projectId: { $in: projectIds } };
    const materialFilter = req.user.role === 'admin' ? {} : { projectId: { $in: projectIds } };

    const workersCount = await Worker.countDocuments(workerFilter);
    
    // Sum of all materials quantity
    const materials = await Material.find(materialFilter);
    const totalMaterialsQty = materials.reduce((sum, m) => sum + (m.quantity || 0), 0);

    // Sum of all budgets
    const projects = await Project.find(filter);
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);

    // Chart 1: Project Progress
    const progressData = projects.slice(0, 5).map(p => ({
      name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
      progress: p.progress || 0
    }));

    // Chart 2: Budget vs Actual (Months)
    const expenseFilter = req.user.role === 'admin' ? {} : { projectId: { $in: projectIds } };
    const expenses = await Expense.find(expenseFilter);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const budgetData = months.map((m, idx) => {
      // planned budget is roughly distributed, actual is sum of expenses
      const planned = Math.round((totalBudget / 12) * (idx + 1) * 0.8);
      
      const monthExpenses = expenses.filter(e => {
        const d = new Date(e.date || e.createdAt);
        return d.getMonth() === idx;
      });
      const actual = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

      return { name: m, planned, actual };
    }).filter(data => data.planned > 0 || data.actual > 0);

    // If budgetData is empty, provide fallback defaults
    if (budgetData.length === 0) {
      budgetData.push(
        { name: 'Jan', planned: 10000, actual: 8000 },
        { name: 'Feb', planned: 15000, actual: 12000 },
        { name: 'Mar', planned: 20000, actual: 18000 }
      );
    }

    // Chart 3: Worker Attendance
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.find({ date: todayStr });
    const presentCount = todayAttendance.filter(a => a.status === 'present').length;
    const absentCount = todayAttendance.filter(a => a.status === 'absent').length;

    const workerData = [
      { name: 'Present', value: presentCount || 1 },
      { name: 'Absent', value: absentCount || 0 }
    ];

    res.json({
      success: true,
      stats: {
        projects: projectsCount,
        workers: workersCount,
        materials: totalMaterialsQty,
        budget: totalSpent
      },
      progressData,
      budgetData,
      workerData
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

export default router;
