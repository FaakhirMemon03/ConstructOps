import Project from '../models/project.model.js';
import Expense from '../models/expense.model.js';
import Worker from '../models/worker.model.js';
import Alert from '../models/alert.model.js';
import DailyReport from '../models/dailyReport.model.js';

// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Private (Owner, Manager)
export const createProject = async (req, res) => {
  const { name, location, budget, startDate, endDate, status } = req.body;

  try {
    if (!name || !location || !budget || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const project = await Project.create({
      name,
      location,
      budget,
      startDate,
      endDate,
      status: status || 'active',
      companyId: req.user.companyId,
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get all projects for user's company
// @route   GET /api/v1/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ companyId: req.user.companyId });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get single project details
// @route   GET /api/v1/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.id || req.params.id);

    if (!project || project.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private (Owner, Manager)
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project || project.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private (Owner only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || project.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get project dashboard summary
// @route   GET /api/v1/projects/:id/dashboard
// @access  Private
export const getProjectDashboard = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findById(projectId);
    if (!project || project.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // 1. Sum up expenses for this project
    const expenses = await Expense.find({ projectId });
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

    // Update spent in project model to keep in sync
    if (project.spent !== totalSpent) {
      project.spent = totalSpent;
      await project.save();
    }

    // 2. Count workers
    const activeWorkers = await Worker.countDocuments({ projectId });

    // 3. Count active unread alerts
    const activeAlerts = await Alert.find({ projectId, isRead: false }).sort({ createdAt: -1 });

    // 4. Fetch latest daily site reports (last 5)
    const latestReports = await DailyReport.find({ projectId })
      .sort({ date: -1 })
      .limit(5)
      .populate('addedBy', 'name');

    // 5. Gather category-wise expenses
    const expensesByCategory = {
      labor: 0,
      material: 0,
      transport: 0,
      misc: 0,
    };
    expenses.forEach((exp) => {
      if (expensesByCategory[exp.category] !== undefined) {
        expensesByCategory[exp.category] += exp.amount;
      }
    });

    res.json({
      success: true,
      data: {
        projectId: project._id,
        projectName: project.name,
        location: project.location,
        budget: project.budget,
        spent: totalSpent,
        progress: project.progress,
        status: project.status,
        activeWorkers,
        alerts: activeAlerts,
        latestReports,
        expensesByCategory,
      },
    });
  } catch (error) {
    console.error('Project dashboard fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};
